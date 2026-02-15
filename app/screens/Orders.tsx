import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator} from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../Firebaseconfig";
import { ref, onValue } from "firebase/database";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

interface OrderItem {
    id: string;
    createdAt: number;
    totalPrice: number;
    status: string;
    items: any[];
}

const Orders = ({ navigation }: any) => {
    const user = FIREBASE_AUTH.currentUser;
    const [orders, setOrders] = useState<OrderItem[]>([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            if (!user) return;
            setLoading(true);
            const ordersRef = ref(FIREBASE_DB, `orders/${user.uid}`);
            const unsubscribe = onValue(ordersRef, (snapshot) => {
                const data = snapshot.val();
                if (!data) {
                    setOrders([]);
                    setLoading(false);
                    return;
                }
                const orderArray = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));

                orderArray.sort((a, b) => b.createdAt - a.createdAt);
                setOrders(orderArray);
                setLoading(false);
            });

            return () => unsubscribe();
        }, [user])
    );

    const renderOrder = ({ item }: { item: OrderItem }) => (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.orderId}>Order ID: {item.id.slice(0, 8)}</Text>
                <Text style={styles.status}>{item.status}</Text>
            </View>

            <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString()}
            </Text>

            {item.items.map((book, index) => (
                <View key={index} style={styles.itemRow}>
                    <Image source={{ uri: book.picture }} style={styles.image} />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.title}>{book.title}</Text>
                        <Text style={styles.price}>{book.price} ฿</Text>
                    </View>
                </View>
            ))}

            <Text style={styles.total}>Total: {item.totalPrice} ฿</Text>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0B0F4C" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.backRow}>
                        <Image source={require("../../assets/left.png")} 
                            style={styles.backIcon} 
                        />
                        <Text style={styles.backText}>Order History</Text>
                    </View>    
                </TouchableOpacity>
                <View style={{ width: 28 }} /> 
            </View>

            {orders.length === 0 ? (
                <Text style={styles.empty}>No orders yet.</Text>
            ) : (
                <FlatList
                    data={orders}
                    renderItem={renderOrder}
                    keyExtractor={(item) => item.id}
                />
                )}
        </View>
    );
};

export default Orders;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: "#f2f2f2",
    },
    topBar: {
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
    header: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0B0F4C",
    },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 15,
        elevation: 3,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    orderId: {
        fontWeight: "bold",
    },
    status: {
        color: "#2f80ed",
        fontWeight: "bold",
    },
    date: {
        fontSize: 12,
        marginBottom: 10,
    },
    itemRow: {
        flexDirection: "row",
        marginBottom: 10,
        alignItems: "center",
    },
    image: {
        width: 40,
        height: 60,
        marginRight: 10,
    },
    title: {
        fontSize: 14,
    },
    price: {
        fontSize: 13,
        color: "#666",
    },
    total: {
        marginTop: 10,
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "right",
    },
    empty: {
        textAlign: "center",
        marginTop: 50,
        color: "#666",
    },
    loading: {
        flex: 1,
        justifyContent: "center",
    },
});
