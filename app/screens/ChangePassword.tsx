import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { FIREBASE_AUTH } from "../../Firebaseconfig";
import { sendPasswordResetEmail } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";

const ChangePassword = () => {
  const navigation = useNavigation<any>();
  const user = FIREBASE_AUTH.currentUser;

  const handleReset = async () => {
    if (!user?.email) return;

    await sendPasswordResetEmail(FIREBASE_AUTH, user.email);
    Alert.alert(
      "Reset Password",
      "We sent a reset link to your email."
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Password</Text>

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
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f2f2f2", flex: 1 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 16, marginBottom: 10 },
  email: { fontSize: 16, fontWeight: "bold", marginBottom: 20 },
  btn: {
    backgroundColor: "#16207B",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "bold" },
  backBtn: { marginTop: 10, padding: 10, alignItems: "center" },
  backText: { color: "#333" },
});
