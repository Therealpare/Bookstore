import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import { FIREBASE_AUTH } from "../../Firebaseconfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ChangePassword = () => {
    const navigation = useNavigation<any>();
    const user = FIREBASE_AUTH.currentUser;

    const handleReset = async () => {
        if (!user?.email) return;
        await sendPasswordResetEmail(FIREBASE_AUTH, user.email);
        Alert.alert("Reset Password","We sent a reset link to your email.");

        navigation.goBack();
    };

    return (
    <View style={styles.container}>
        <Text style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={styles.backRow}>
                    <Image source={require("../../assets/left.png")} style={styles.backIcon}/>
                    <Text style={styles.backText}>My Wishlist</Text>
                </View>             
            </TouchableOpacity>
            <View style={{ width: 28 }} /> 
        </Text>
                
        <Text style={styles.text}>  
            A password reset link will be sent to your email: 
        </Text>

        <Text style={styles.email}>{user?.email}</Text>

        <TouchableOpacity style={styles.btn} onPress={handleReset}>
            <Text style={styles.btnText}>Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
        >
            <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
    </View>
    );
};

export default ChangePassword;

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
    text: { 
        fontSize: 16, 
        marginBottom: 10 ,
        marginLeft: 10,
        marginTop: 20,
    },
    email: { 
        fontSize: 16, 
        fontWeight: "bold", 
        marginBottom: 20,
        marginLeft: 10,
    },
    btn: {
        backgroundColor: "#16207B",
        padding: 12,
        alignItems: "center",
        borderRadius: 8,
        marginLeft: 10,
        marginRight: 10,
        marginTop: 30,
    },
    btnText: { 
        color: "#fff", 
        fontWeight: "bold",
    },
    backBtn: { 
        marginTop: 10, 
        padding: 10, 
        alignItems: "center" ,
    },
    back: {
        marginTop: 5,
    }
});
