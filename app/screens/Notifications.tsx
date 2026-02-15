import React, { useEffect, useState } from "react";
import {View, Text, StyleSheet, Image, FlatList, TouchableOpacity, Alert, Dimensions} from "react-native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../Firebaseconfig";
import { ref, onValue } from "firebase/database";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";

type NotificationItem = {
    id: string;
    title: string;
    message: string;
    createdAt: number;
};

const Notifications = () => {
    const navigation = useNavigation<any>();
    const user = FIREBASE_AUTH.currentUser;
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);

    useEffect(() => {
        if (!user) return;
        const notiRef = ref(FIREBASE_DB, `notifications/${user.uid}`);

        const unsubscribe = onValue(notiRef, (snapshot) => {
            const data = snapshot.val();
            if (!data) {
                setNotifications([]);
                return;
            }

            const notiArray = Object.keys(data).map((key) => ({
                id: key,
                ...data[key],
            }));

            notiArray.sort((a, b) => b.createdAt - a.createdAt);
            setNotifications(notiArray);
        });
        return () => unsubscribe();
    }, []);

    const renderItem = ({ item }: { item: NotificationItem }) => (
        <View style={styles.card}>
            <MaterialIcons name="notifications" size={24} color="#0B0F4C" />
            <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.date}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <View style={styles.backRow}>
                        <Image source={require("../../assets/left.png")} 
                            style={styles.backIcon} 
                        />
                        <Text style={styles.backText}>Notifications</Text>
                    </View>  
                </TouchableOpacity>
                <View style={{ width: 28 }} /> 
            </View>

            {notifications.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialIcons name="notifications-off" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>No notifications available.</Text>
                </View>
            ) : (
                <FlatList
                    data={notifications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingBottom: 30 }}
                />
            )}
        </View>
    );
}

export default Notifications;

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
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#0B0F4C",
    },
    card: {
        flexDirection: "row",
        alignItems: "flex-start",
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        elevation: 2,
    },
    title: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#0B0F4C",
    },
    message: {
        fontSize: 13,
        color: "#555",
        marginTop: 4,
    },
    date: {
        fontSize: 11,
        color: "#999",
        marginTop: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyText: {
        marginTop: 10,
        color: "#999",
        fontSize: 14,
    },
});