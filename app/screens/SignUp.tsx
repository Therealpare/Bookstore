import React, { useState } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator, KeyboardAvoidingView, Platform
} from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../Firebaseconfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  Tabs: undefined;
};

type SignupNav = NativeStackNavigationProp<AuthStackParamList, 'Signup'>;

const Signup = () => {
  const navigation = useNavigation<SignupNav>();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const auth = FIREBASE_AUTH;

  const handleSignup = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, { displayName: username });

      await set(ref(FIREBASE_DB, `users/${user.uid}`), {
        username,
        email,
        address: '',
        createdAt: Date.now(),
      });

      Alert.alert(
        'Signup Successful!',
        'Your account has been created 🎉',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Image
          source={{
             uri: "https://firebasestorage.googleapis.com/v0/b/bookstore-2abd0.appspot.com/o/MENU%20(2)_0.png?alt=media&token=60a18526-4926-494a-ad01-5179090988c7",
          }}
          style={styles.image}
        />

        <Text style={styles.title}>Create Your Account</Text>

        <TextInput 
          style={styles.input} 
          placeholder="Username" 
          value={username} 
          onChangeText={setUsername} 
        />
        <TextInput 
          style={styles.input} 
          placeholder="Email" 
          value={email} 
          autoCapitalize="none" 
          keyboardType="email-address"
          onChangeText={setEmail} 
        />
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPass(!showPass)}
          >
            <MaterialIcons
              name={showPass ? "visibility" : "visibility-off"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Confirm Password"
            secureTextEntry={!showConfirmPass}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowConfirmPass(!showConfirmPass)}
          >
            <MaterialIcons
              name={showConfirmPass ? "visibility" : "visibility-off"}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#121764" />
        ) : (
          <>
            <TouchableOpacity 
              style={styles.button} 
              onPress={handleSignup}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <View style={styles.row}>
              <Text 
                style={{ color: 'black' }}>Already have an account? 
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.link}> Login</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: { 
    marginHorizontal: 20, 
    flex: 1, 
    justifyContent: "center" 
  },
  image: { 
    width: 200, 
    height: 200, 
    alignSelf: "center", 
    marginBottom: 20 
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    textAlign: "center", 
    marginBottom: 20 
  },
  input: { 
    marginVertical: 6,
    height: 50, 
    borderWidth: 1, 
    borderRadius: 8, 
    padding: 12, 
    backgroundColor: "#fff" 
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    height: 50,
    justifyContent: "center",
  },
  button: { 
    backgroundColor: "#121764", 
    paddingVertical: 15, 
    borderRadius: 8, 
    marginVertical: 10, 
    alignItems: "center" 
  },
  buttonText: { 
    color: "#fff", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 10 
  },
  link: { 
    color: '#007bff', 
    fontWeight: 'bold', 
    fontSize: 14
  }
});
