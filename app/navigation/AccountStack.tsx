import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AccountHome from "../screens/AccountHome";
import EditProfile from "../screens/EditProfile";
import Wishlist from "../screens/Wishlist";
import Orders from "../screens/Orders";
import Notifications from "../screens/Notifications";
import ChangePassword from "../screens/ChangePassword";

export type AccountStackParamList = {
    AccountHome: undefined;
    EditProfile: undefined;
    Wishlist: undefined;
    Orders: undefined;
    Notifications: undefined;
    ChangePassword: undefined;
};

const Stack = createNativeStackNavigator<AccountStackParamList>();

const AccountStack = () => {
    return (
        <Stack.Navigator id="AccountStack"  screenOptions={{ headerShown: false }} >
            <Stack.Screen name="AccountHome" component={AccountHome} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
            <Stack.Screen name="Wishlist" component={Wishlist} />
            <Stack.Screen name="Orders" component={Orders} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="ChangePassword" component={ChangePassword} />
        </Stack.Navigator>
    );
};

export default AccountStack;
