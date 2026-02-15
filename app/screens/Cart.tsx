import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import OrderSummary from './OrderSummary';
import { CartItem } from '../context/CartContext';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebaseconfig';
import { ref, push, set, get, update } from "firebase/database";

const Cart = () => {
    const {cartItems, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = useContext(CartContext)!;
    const [currentScreen, setCurrentScreen] = useState<"Cart" | "OrderSummary">("Cart");

    const calculateTotalPrice = () => {
        return cartItems.reduce(
            (total: number, item) =>
                total + item.quantity * Number(item.book.price),
            0
        );
    }

    const handleCheckout = async () => {
        console.log("🔥 CHECKOUT BUTTON PRESSED");
        const user = FIREBASE_AUTH.currentUser;
        
        console.log("User:", user?.uid);
        console.log("Cart Items:", cartItems);

        if (!user) {
            Alert.alert("Login Required", "Please login to proceed with checkout.");
            return;
        }

        if (cartItems.length === 0) {
            Alert.alert("Cart is Empty", "Your cart is empty");
            return;
        }

        try {
            for (const item of cartItems) {
                const bookRef = ref(FIREBASE_DB, `books/${item.book.id}`);
                const snapshot = await get(bookRef);
                const bookData = snapshot.val();
                
                console.log("Checking stock:", bookData);
                if (!bookData) {
                    Alert.alert("Error", `Book not found: ${item.book.title}`);
                    return;
                }

                if (bookData.stock < item.quantity) {
                    Alert.alert(
                        "Out of Stock",
                        `Not enough stock for "${item.book.title}". Only ${bookData.stock} left.`
                    );
                    return;
                }
            }

            for (const item of cartItems) {
                const bookRef = ref(FIREBASE_DB, `books/${item.book.id}`);
                const snapshot = await get(bookRef);
                const bookData = snapshot.val();

                await update(bookRef, {
                    stock: bookData.stock - item.quantity,
                });
            }

            const orderRef = push(ref(FIREBASE_DB, `orders/${user.uid}`));
            const orderData = {
                createdAt: Date.now(),
                status: "pending",
                totalPrice: calculateTotalPrice(),
                items: cartItems.map(item => ({
                    bookId: item.book.id,
                    title: item.book.title,
                    price: item.book.price,
                    quantity: item.quantity,
                    picture: item.book.picture,
                })),
            };
            console.log("Saving order:", orderData);

            await set(orderRef, orderData);

            clearCart();
            Alert.alert("Order Placed", "Your order has been placed successfully.");
            setCurrentScreen("Cart"); 
        } catch (error) {
            console.log("Checkout Error:", error);
            Alert.alert("Error", "Checkout failed.");
        }
    };

    const renderItem = ({ item }: { item: CartItem }) => (
        <View style={styles.cartItem}>
            <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeFromCart(item.book.id)}
            >
                <Text style={styles.removeButtonText}>X</Text>
            </TouchableOpacity>

            <Image
                source={{ uri: item.book.picture }}
                style={styles.bookImage}
            />

            <View style={styles.infoContainer}>
                <Text style={styles.categoryText}>{item.book.category}</Text>
                <Text style={styles.titleText}>{item.book.title}</Text>
                <Text style={styles.authorText}>{item.book.author}</Text>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.squareButton}
                        onPress={() => decreaseQuantity(item.book.id)}
                    >
                        <Text style={styles.buttonTextSmall}>-</Text>
                    </TouchableOpacity>

                    <Text style={styles.quantity}>{item.quantity}</Text>

                    <TouchableOpacity
                        style={styles.squareButton}
                        onPress={() => increaseQuantity(item.book.id)}
                    >
                        <Text style={styles.buttonTextSmall}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.price}>
                {(item.quantity * Number(item.book.price))} ฿
            </Text>
        </View>
    );

    if (currentScreen === 'OrderSummary') {
        const totalPrice = calculateTotalPrice();
        return (
            <OrderSummary
                totalPrice={totalPrice}
                onGoBack={() => setCurrentScreen('Cart')}
                onConfirmOrder={handleCheckout}  // 🔥 ส่งไปสั่งซื้อจริง
            />
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Cart</Text>

            {cartItems.length === 0 ? (
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
            ) : (
                <FlatList 
                    data={cartItems} 
                    renderItem={renderItem} 
                    keyExtractor={(item) => item.book.id.toString()}
                />
            )}

            {cartItems.length > 0 && (
                <TouchableOpacity 
                    style={styles.checkoutButton}
                    onPress={() => setCurrentScreen("OrderSummary")}
                >
                    <Text style={styles.buttonTextBig}>Proceed to Checkout</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

          
            

const styles = StyleSheet.create({
    emptyCartText: {
        fontSize: 18,
        color: "#0B0F4C",
        textAlign: 'center',
        marginTop: 20,
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    title: {
        padding: 40,
        fontSize: 20,
        fontWeight: "bold",
        color: "#0B0F4C",
        textAlign: 'center',
    },
    infoContainer: {
        flex: 1,
    },
    categoryText: {
        fontSize: 14,
        color: "#DEDEDE",
        fontWeight: "300",
        paddingTop: 10,
    },
    titleText: {
        fontSize: 20,
        paddingVertical: 7,
        color: "#fff",
        fontWeight: "bold",
    },
    authorText: {
        fontSize: 14,
        color: "#fff",
        paddingBottom: 20,
    },
    cartItem: {
        padding: 0,
        backgroundColor: "#0B0F4B",
        borderRadius: 10,
        marginVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden',
        width: '100%',
        height: 155,
        justifyContent: 'space-between',
        position: 'relative',
    },
    removeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
    removeButtonText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    squareButton: {
        width: 25,
        height: 25,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 5,
        borderRadius: 5,
        bottom: 10,
    },
    buttonTextSmall: {
        color: "#0B0F4B",
        fontWeight: "bold",
        fontSize: 16,
    },
    buttonTextBig: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    quantity: {
        color: "white",
        fontSize: 20,
        paddingHorizontal: 10,
        bottom: 10,
    },
    price: {
        color: "white",
        fontSize: 25,
        fontWeight: "500",
        position: 'absolute',
        right: 10,
        bottom: 10,
    },
    checkoutButton: {
        backgroundColor: "#0B0F4C",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    bookImage: {
        width: '27.3%',
        height: '100%',
        resizeMode: 'contain',
        marginRight: 10,
    },
});

export default Cart;
