import React, { useState } from 'react';
import {View, Text, TextInput, Alert, TouchableOpacity,
  StyleSheet, Image, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { FIREBASE_AUTH } from '../../Firebaseconfig';
import { signInWithEmailAndPassword,  GoogleAuthProvider, signInWithCredential, sendPasswordResetEmail,} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  Tabs: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;

const CLIENT_ID ="43435045240-fce02bh3ei941b5sj8gs361icmccss2j.apps.googleusercontent.com";

const Login = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const auth = FIREBASE_AUTH;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'your.app.scheme',
      }),
    },
    { authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth' }
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;

      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert('Google Login Success 🎉');
          navigation.navigate('Tabs');
        })
        .catch((err) => {
          console.log(err);
          Alert.alert('Google Login Failed');
        });
    }
  }, [response]);

  const signIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert(
        'Login successful!',
        'Welcome to Book Shelf Store 🎉',
        [{ text: 'OK', onPress: () => navigation.navigate('Tabs') }]
      );
    } catch (error) {
      Alert.alert('Login failed!', 'Check email and password.');
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    if (!email) {
      Alert.alert('Enter Email', 'Type your email first');
      return;
    }

    await sendPasswordResetEmail(auth, email);
    Alert.alert('Reset email sent', 'Check your inbox');
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Image
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/bookstore-2abd0.appspot.com/o/MENU%20(2)_0.png?alt=media&token=60a18526-4926-494a-ad01-5179090988c7",
          }}
          style={styles.image}
        />

        <Text style={styles.title}>Login to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
        />

        <View style={styles.passwordRow}>
          <TextInput
            secureTextEntry={!showPassword}
            style={styles.passwordInput}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <MaterialIcons
              name={showPassword ? 'visibility' : 'visibility-off'}
              size={22}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate("ForgotPassword")}
          style={{ marginTop: 10, alignItems: "center" }}
        >
          <Text style={{ color: "#007bff" }}>Forgot Password?</Text>
        </TouchableOpacity>


        {loading ? (
          <ActivityIndicator size="large" color="#121764" />
        ) : (
          <TouchableOpacity style={styles.button} onPress={signIn}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        )}

        <View style={styles.row}>
          <Text style={{ color: 'black' }}>
            Don’t have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.line} />
        </View>

        <TouchableOpacity
          style={styles.googleBtn}
          onPress={() => promptAsync()}
        >
          <AntDesign name="google" size={24} color="white" />
          <Text style={styles.googleText}>Login with Google</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: { 
    marginHorizontal: 20, 
    flex: 1, 
    justifyContent: 'center' 
  },
  image: { 
    width: 200, 
    height: 200, 
    alignSelf: "center", 
    marginBottom: 20 
  },
  title: { 
    fontSize: 18, 
    textAlign: 'center', 
    marginBottom: 20, 
    fontWeight: 'bold'
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginVertical: 4,
  },
  passwordInput: { 
    flex: 1, 
    height: 50 
  },
  button: {
    backgroundColor: '#121764',
    paddingVertical: 15,
    borderRadius: 4,
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  },
  forgot: { 
    color: '#007bff', 
    textAlign: 'right', 
    marginBottom: 10 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 40 
  },
  link: { 
    color: '#007bff', 
    fontWeight: 'bold' 
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
    marginHorizontal: 10,
  },
  orText: { 
    textAlign: 'center', 
    marginVertical: 15, 
    color: '#555' 
  },
  googleBtn: {
    flexDirection: 'row',
    backgroundColor: '#DB4437',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: { 
    color: 'white',
    marginLeft: 10, 
    fontWeight: 'bold' 
  },
});
