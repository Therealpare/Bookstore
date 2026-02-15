import React, { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "./Firebaseconfig";
import Login from "./app/screens/Login";
import Signup from "./app/screens/SignUp";
import TabNavigation from "./app/navigation/TabNavigation";
import ForgotPassword from "./app/screens/ForgotPassword";
import AccountHome from "./app/screens/AccountHome";
import EditProfile from "./app/screens/EditProfile";
import ChangePassword from "./app/screens/ChangePassword";
import CartProvider from "./app/context/CartContext";

export type RootStackParamList = {
    Login: undefined;
    Signup: undefined;
    ForgotPassword: undefined; 
    Tabs: undefined;
    AccountHome: undefined;
    EditProfile: undefined;
    ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#121764" />
            </View>
        );
    }

    return (
        <CartProvider>
            <NavigationContainer>
                <Stack.Navigator id="RootStack" screenOptions={{ headerShown: false }}>
                    {user ? (
                    <>
                        <Stack.Screen name="Tabs" component={TabNavigation} />
                        <Stack.Screen name="AccountHome" component={AccountHome} />
                        <Stack.Screen name="EditProfile" component={EditProfile} />
                        <Stack.Screen name="ChangePassword" component={ChangePassword} />
                    </>
                    ) : (
                    <>
                        <Stack.Screen name="Login" component={Login} />
                        <Stack.Screen name="Signup" component={Signup} />
                        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                    </>
                    )}

                </Stack.Navigator>
            </NavigationContainer>
        </CartProvider>
    );
};

export default App;
