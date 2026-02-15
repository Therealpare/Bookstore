import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { FIREBASE_AUTH } from "../../Firebaseconfig";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type AuthStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined;
    Tabs: undefined;
};

type ForgotNav = NativeStackNavigationProp<
  AuthStackParamList,
  "ForgotPassword"
>;

const ForgotPassword = () => {
    const navigation = useNavigation<ForgotNav>();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        setLoading(true);

        try {
        await sendPasswordResetEmail(FIREBASE_AUTH, email);

            Alert.alert(
                "Email Sent!",
                "Please check your inbox to reset your password.",
                [
                    {
                        text: "OK",
                        onPress: () => navigation.navigate("Login"),
                    },
                ]
            );
        } catch (error: any) {
            console.log(error);
            Alert.alert(
                "Error",
                "This email is not registered or something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                    Enter your email and we will send you a password reset link.
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#121764" />
                ) : (
                    <>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleResetPassword}
                        >
                            <Text style={styles.buttonText}>Send Reset Link</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.navigate("Login")}
                        >
                            <Text style={styles.backText}>Back to Login</Text>
                        </TouchableOpacity>
                    </>
                )}
            </KeyboardAvoidingView>
        </View>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        marginHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
    },
    subtitle: {
        textAlign: "center",
        color: "#555",
        marginBottom: 20,
    },
    input: {
        marginVertical: 6,
        height: 50,
        borderWidth: 1,
        borderRadius: 8,
        padding: 12,
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "#121764",
        paddingVertical: 15,
        borderRadius: 8,
        marginVertical: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    backButton: {
        marginTop: 10,
        alignItems: "center",
    },
    backText: {
        color: "#007bff",
        fontWeight: "bold",
    },
});
