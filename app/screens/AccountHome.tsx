import React from "react";
import {View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { FIREBASE_AUTH } from "../../Firebaseconfig";

const MenuItem = ({
    icon,
    label,
    onPress,
}: {
    icon: React.ReactNode;
    label: string;
    onPress?: () => void;
 }) => {
    return (
        <TouchableOpacity style={styles.menuItem} onPress={onPress}> 
            <Text style={styles.menuLabel}>{label}</Text>
            <MaterialIcons name="chevron-right" size={20} color="#999" />
        </TouchableOpacity>
    );
};

const AccountHome = () => {
    const navigation = useNavigation<any>();
    const user = FIREBASE_AUTH.currentUser;

    return (
        <ScrollView style={styles.container}>

        <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>My Profile</Text>

            <TouchableOpacity style={styles.settingBtn}>
                <MaterialIcons name="settings" size={22} color="#000" />
            </TouchableOpacity>
        </View>

        <View style={styles.profileBox}>
            <Image
            source={{
                uri:
                user?.photoURL ||
                "https://firebasestorage.googleapis.com/v0/b/bookstore-2abd0.appspot.com/o/user%20icon.png?alt=media",
            }}
            style={styles.avatar}
            />

            <View style={{ marginLeft: 12 }}>
                <View style={styles.infoRow}>
                    <Image  style={styles.smallIcon} />
                    <Text style={styles.username}>
                        {user?.displayName || "Guest User"}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Image style={styles.smallIcon} />
                    <Text style={styles.email}>
                        {user?.email}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => navigation.navigate("EditProfile")}
                >
                    <Text style={styles.editBtnText}>Edit Profile</Text>
                </TouchableOpacity>
            </View>
         </View>

        <View style={styles.divider} />

        <View style={styles.menuBox}>
            <MenuItem icon={ <MaterialIcons name="favorite-border" size={22} color="#0B0F4C" />
            }
            label="My Wishlist"
            onPress={() => navigation.navigate("Wishlist")}
            />

        <MenuItem
            icon={<AntDesign name="inbox" size={22} color="#0B0F4C" />}
            label="Order History"
            onPress={() => navigation.navigate("Orders")}
            />

        <MenuItem
            icon={<Entypo name="bell" size={22} color="#0B0F4C" />}
            label="Notifications"
            onPress={() => navigation.navigate("Notifications")}
            />
        </View>
        
        <MenuItem
            icon={<MaterialIcons name="password" size={22} color="#0B0F4C" />}
            label="Change Password"
            onPress={() => navigation.navigate("ChangePassword")}
        />

        <View style={styles.divider} />

        
        <TouchableOpacity
            style={styles.logoutBtn}
            onPress={() => FIREBASE_AUTH.signOut()}
        >
            <MaterialIcons name="logout" size={20} color="white" />
            <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

            <Text style={styles.version}>@Bookstore</Text>
        </ScrollView>
    );
};

export default AccountHome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        padding: 16,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
        marginTop: 60,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    settingBtn: {
        position: "absolute",
        right: 0,
    },
    profileBox: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        borderRadius: 12,
        elevation: 2,
        marginTop: 10,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    smallIcon: {
        width: 16,
        height: 16,
        marginRight: 6,
        tintColor: "#0B0F4C", 
    },
    username: {
        fontSize: 20,
        fontWeight: "bold",
    },
    email: {
        color: "#555",
        marginBottom: 8,
    },
    editBtn: {
        backgroundColor: "#16207B",
        paddingVertical: 6,
        width: 100,
        borderRadius:20,
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        left: 20,
    },
    editBtnText: {
        color: "white",
        fontWeight: "500",
        fontSize: 12,
    },
    divider: {
        height: 1,
        backgroundColor: "#ddd",
        marginVertical: 20,
    },
    menuBox: {
        backgroundColor: "white",
        borderRadius: 12,
        paddingVertical: 6,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    menuLabel: {
        flex: 1,
        marginLeft: 10,
        fontSize: 16,
        color: "#0B0F4C",
    },
    logoutBtn: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ff4d4f",
        padding: 12,
        borderRadius: 10,
        marginTop: 200,
    },
    logoutText: {
        color: "white",
        marginLeft: 8,
        fontWeight: "bold",
    },
    version: {
        textAlign: "center",
        marginTop: 20,
        color: "#999",
    },
});
