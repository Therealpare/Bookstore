import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, Alert} from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { CartContext } from '../context/CartContext'; 
import PurchaseComplete from './PurchaseComplete';

type OrderSummaryProps = {
    totalPrice: number;
    onGoBack: () => void;
    onConfirmOrder: () => void;
};

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
    totalPrice, 
    onGoBack, 
    onConfirmOrder 
}) => {

    const { cartItems } = useContext(CartContext)!;

    const renderItem = ({ item }: any) => (
        <View style={styles.itemRow}>
            <Image source={{ uri: item.book.picture }} style={styles.image} />
            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.book.title}</Text>
                <Text style={styles.quantity}>
                    Qty: {item.quantity}
                </Text>
            </View>
            <Text style={styles.price}>
                {item.quantity * Number(item.book.price)} ฿
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={onGoBack}>
                    <Ionicons name="arrow-back" size={24} color="#0B0F4C" />
                </TouchableOpacity>
                <Text style={styles.header}>Checkout</Text>
            </View>
            <Text style={styles.OrderSummary}>Order Summary</Text>

            <FlatList
                data={cartItems}
                renderItem={renderItem}
                keyExtractor={(item) => item.book.id.toString()}
                contentContainerStyle={{ paddingBottom: 10 }}
            />

            {/* SubTotal */}
            <View style={styles.priceRow}>
                <Text style={styles.label}>SubTotal</Text>
                <Text style={styles.price}>{totalPrice} ฿</Text>
            </View>

            {/* Shipping */}
            <View style={styles.priceRow}>
                <Text style={styles.label}>Shipping</Text>
                <Text style={styles.price}>50 ฿</Text>
            </View>

            {/* Line */}
            <View style={styles.line} />

            {/* Total */}
            <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalPrice}>{totalPrice + 50} ฿</Text>
            </View>

            <TouchableOpacity style={styles.Button} onPress={onConfirmOrder}>
                <Text style={styles.buttonText}>Proceed to Checkout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f2f2f2',
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
        paddingTop: 30,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0B0F4C",
        flex: 1,
    },
    backButton: {
        padding: 10,
    },
    OrderSummary: {
        fontSize: 23,
        fontWeight: "600",
        color: '#0B0F4C',
        marginTop: -10,
        marginBottom: 15,
    },
    priceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
    },
    label: {
        fontSize: 17,
        color: '#0B0F4C',
    },
    price: {
        fontSize: 17,
        color: '#0B0F4C',
    },
    totalLabel: {
        fontSize: 23,
        fontWeight: "500",
        color: '#0B0F4C',
    },
    totalPrice: {
        fontSize: 23,
        fontWeight: "500",
        color: '#0B0F4C',
    },
    line: {
        borderBottomColor: '#0B0F4C',
        borderBottomWidth: 1,
        marginVertical: 15,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    Button: {
        backgroundColor: "#0B0F4C",
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    message: {
        fontSize: 18,
        color: '#0B0F4C',
        textAlign: 'center',
        marginVertical: 20,
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
    },
    image: {
        width: 50,
        height: 70,
        marginRight: 10,
    },
    title: {
        fontSize: 14,
        fontWeight: "bold",
    },
    quantity: {
        fontSize: 13,
        color: "#666",
    },
});

export default OrderSummary;
