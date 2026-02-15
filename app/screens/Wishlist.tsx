import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert, Dimensions } from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../Firebaseconfig";
import { ref, onValue, remove } from "firebase/database";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { CartContext } from "../context/CartContext";
import { Book } from "../../type";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

interface WishlistItem {
    id: string;
    title: string;
    author: string;
    category: string;
    price: string;
    picture: string;
}

const Wishlist = () => {
    const navigation = useNavigation<any>();
    const user = FIREBASE_AUTH.currentUser;
    const { addToCart } = useContext(CartContext);

    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        if (!user) return;
        const wishRef = ref(FIREBASE_DB, `wishlists/${user.uid}`);
        
        const unsubscribe = onValue(wishRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setBooks([]);
                return;
            }

            const bookIds = Object.keys(data);
            const booksRef = ref(FIREBASE_DB, "books");

            onValue(booksRef, (bookSnap) => {
                const bookData = bookSnap.val();
                if (!bookData) return;

                const wishBooks = bookIds.map((id) => ({
                    id,
                    ...bookData[id],
                }))
                .filter(Boolean);
                setBooks(wishBooks);
            });
        });
        return () => unsubscribe();
    }, []);

    const removeFromWishlist = async (bookId: string) => {
        if (!user) return;
        await remove(ref(FIREBASE_DB, `wishlists/${user.uid}/${bookId}`));
        Alert.alert("Removed", "Book removed from wishlist");
    };

    const renderItem = ({ item }: { item: Book }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.heartBtn}
                onPress={() => removeFromWishlist(item.id)}
            >
                <Ionicons name="heart" size={25} color="red" />
            </TouchableOpacity>
            <Image source={{ uri: item.picture }} style={styles.image} />
            <View style={{ flex : 1 }}>
                <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">{item.author}</Text>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.price}>{item.price} ฿</Text>
            </View>

            <View style={styles.buttonRow}>
                <TouchableOpacity 
                    style={styles.cartBtn} 
                    onPress={() => {
                        addToCart(item);
                        Alert.alert("Success", "Book added to cart 🛒",[{ text: "OK" }]);
                    }}
                >
                    <Ionicons name="cart" size={20} color="#fff" />
                    <Text style={styles.cartText}>Add to cart</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
    
    return (
        <View style={styles.container}>
            <Text style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.backRow}>
                        <Image source={require("../../assets/left.png")} 
                            style={styles.backIcon} 
                        />
                        <Text style={styles.backText}>My Wishlist</Text>
                    </View>             
                </TouchableOpacity>
                <View style={{ width: 28 }} /> 
            </Text>
            <Text style={styles.subtitle}>{books.length} books</Text>

            <FlatList
                data={books}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 40 }}
            />
        </View>
    );
};


export default Wishlist;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f2f2f2",
        padding: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 50,
        marginBottom: 20,
    },
    backRow: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    backIcon: {
        width: 22,
        height: 22,
        marginRight: 6,
    },
    backText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 20,
    },
    subtitle: {
        color: "#666",
        marginBottom: 15,
        left: 40,
        top: -10,
    },
    tabRow: {
        flexDirection: "row",
        marginBottom: 15,
        flexWrap: "wrap",
        left: 15,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 14,
        marginBottom: 15,
        flexDirection: "row",
        elevation: 3,
        position: "relative",
    },
    heartBtn: {
        position: "absolute",
        right: 15,
        top: 5,
        backgroundColor: "white",
        padding: 6,
        borderRadius: 20,
        elevation: 3,

    },
    image: {
        width: 90,
        height: 130,
        borderRadius: 12,
        marginRight: 12,
    },
    category: {
        backgroundColor: "#eee",
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        fontSize: 12,
        marginBottom: 4,
        marginTop: 4,
    },
    title: {
        marginTop: 4,
        fontSize: 16,
        fontWeight: "bold",
    },
    author: {
        marginTop: 4,
        color: "#777",
        marginBottom: 6,
    },
    price: {
        marginTop: 30,
        fontSize: 18,
        fontWeight: "bold",
        color: "#b45309",
    },
    buttonRow: {
        flexDirection: "row",
        marginTop: 8,
        alignItems: "center",
    },
    cartBtn: {
        flexDirection: "row", 
        alignItems: "center",
        justifyContent: "center",     
        backgroundColor: "#222",
        paddingVertical: 5,
        paddingHorizontal: 14,
        borderRadius: 10,
        marginRight: 8,
        gap: 6,
        marginTop: 90,
    },
    cartText: {
        color: "white",
        fontSize: 12,
    },
});