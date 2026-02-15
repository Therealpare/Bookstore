import React, { use, useEffect, useState } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator, } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FIREBASE_AUTH, FIREBASE_DB } from "../../Firebaseconfig";
import { updateProfile, updateEmail } from "firebase/auth";
import { ref, onValue, update, off } from "firebase/database";
import { Image } from "react-native";

const EditProfile = () => {
    const navigation = useNavigation<any>();
    const user = FIREBASE_AUTH.currentUser;

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState(user?.email || "");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) return;
        const userRef = ref(FIREBASE_DB, `users/${user.uid}`);

        const unsubscribe = onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setUsername(data.username || "");
                setPhone(data.phone || "");
                setAddress(data.address || "");
            }
        });
        return () => off(userRef);
    }, [user]);

    const handleSave = async () => {
        if (!user) return;

        if (!username.trim()) {
            Alert.alert("Error", "Username cannot be empty");
            return;
        }
        setLoading(true);

        try {
            await updateProfile(user, {displayName: username,});

            const userRef = ref(FIREBASE_DB, `users/${user.uid}`);
            await update(userRef, {
                username,
                phone,
                address,
                updatedAt: Date.now(),
            });

            Alert.alert("Saves", "Profile updated successfully");
            navigation.goBack();
        } catch (error) {
            console.log(error);
            Alert.alert("Error", "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity
                style={styles.backRow}
                onPress={() => navigation.goBack()}
            >
                <Image
                    source={require("../../assets/left.png")}
                    style={styles.backIcon}
                />
            </TouchableOpacity>

            <Text style={styles.header}>Edit Profile</Text>
            
            <Text style={styles.label}>Username</Text>
            <TextInput 
                style={styles.input} 
                value={username} 
                onChangeText={setUsername} 
            />

            <Text style={styles.label}>Email</Text>
            <TextInput 
                style={[styles.input, styles.disabledInput]}
                value={email}
                editable={false}
            />

            <Text style={styles.label}>Phone</Text>
            <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone} 
                keyboardType="phone-pad" 
            />

            <Text style={styles.labelAddress}>Address</Text>
            <TextInput 
                style={styles.inputAddress} 
                value={address} 
                onChangeText={setAddress} 
            />

            {loading ? (
                <ActivityIndicator size="large" color="#16207B" />
            ) : (
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        <Text style={styles.saveText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => navigation.navigate("AccountHome")}
                    >
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </ScrollView>
    ); 
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#f2f2f2",
        flexGrow: 1,
    },
    header: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        marginTop: 60,
        textAlign: "center",
    },
    backRow: {
        position: "absolute",
        top: 10,
        left: 15,
        zIndex: 10,
        marginTop: 70,
    },
    backIcon: {
        width: 25,
        height: 25,
        resizeMode: "contain",
    },
    label: {
        marginTop: 35,
        fontWeight: "600",
    },
    labelAddress:{
        marginTop: 10,
        fontWeight: "600",
    },
    input: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
    },
    inputAddress: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 8,
        marginTop: 10,
        height: 100,
    },
    disabledInput: {
        backgroundColor: "#e6e6e6",
        color: "#666",
    },
    buttonRow: {
        flexDirection: "row",     
        justifyContent: "center",
        gap: 10,   
        marginTop: 50,              
    },
    saveBtn: {
        backgroundColor: "#16207B",
        paddingVertical: 10,   // ลดความสูง
        paddingHorizontal: 20, // ลดความกว้าง
        borderRadius: 8,
        alignItems: "center",
    },
    saveText: { 
        color: "#fff",
        fontWeight: "bold" 
    },
    cancelBtn: {
        backgroundColor: "#ccc",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: "center",
    },
    cancelText: { 
        color: "#333" 
    },
});