import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, Text } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Home from '../screens/Home';
import Cart from '../screens/Cart';
import Categories from '../screens/Categories';
import AccountStack from '../navigation/AccountStack';
import { CartContext } from '../context/CartContext';

const Tab = createBottomTabNavigator();

const ACTIVE_COLOR = '#FFFFFF';
const INACTIVE_COLOR = '#0B0F4C';
const BACKGROUND = '#0B0F4C';
const TEXT_COLOR = '#0B0F4C';

const getTabBarIcon = (
    route: { name: string },
    focused: boolean,
    size: number,
    cartCount: number
) => {
    let iconName: keyof typeof MaterialIcons.glyphMap;

    switch (route.name) {
        case 'Home':
            iconName = 'home';
            break;
        case 'Account':
            iconName = 'account-box';
            break;
        case 'Cart':
            iconName = 'shopping-cart';
            break;
        case 'Categories':
            iconName = 'grid-view';
            break;
        default:
            iconName = 'circle';
            break;
    }

    return (
        <View style={[styles.icon, focused && styles.focusedIcon]}>
            <MaterialIcons
                name={iconName}
                size={size}
                color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
            />
            {route.name === 'Cart' && cartCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
            )}
        </View>
    );
};

const TabNavigation = () => {
    const { cartItems } = useContext(CartContext)!;

    const cartCount = cartItems.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <Tab.Navigator
        id="MainTabs"
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, size }) =>
            getTabBarIcon(route, focused, size, cartCount),
            tabBarActiveTintColor: ACTIVE_COLOR,
            tabBarInactiveTintColor: INACTIVE_COLOR,

            tabBarStyle: {
                height: 80,
                paddingTop: 5,
                paddingBottom: 12,
                backgroundColor: '#e6e6e6',
            },

            tabBarLabelStyle: {
                color: TEXT_COLOR,
                fontSize: 12,
                marginTop: 6,
            },

            tabBarItemStyle: {
                padding: 0,
            },
        })}
    >
        <Tab.Screen name="Home" component={Home} options={{ headerShown: false}}/>
        <Tab.Screen name="Categories" component={Categories} options={{ headerShown: false }} />
        <Tab.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
        <Tab.Screen name="Account" component={AccountStack} options={{ headerShown: false }}
            listeners={({ navigation }) => ({
                tabPress: () => {
                const state = navigation.getState();
                const accountTab = state.routes.find(
                    (r) => r.name === "Account"
                );

                const stackState = accountTab?.state as any;
                if (stackState?.index > 0) {
                    navigation.navigate("Account", {
                    screen: "AccountHome",
                    });
                }
                },
            })}
            />
        </Tab.Navigator>
    );
};

export default TabNavigation;

const styles = StyleSheet.create({
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 35,
        borderRadius: 30,
    },
    focusedIcon: {
        backgroundColor: BACKGROUND,
    },
    badge: {
        position: 'absolute',
        top: 0,
        right: 5,
        backgroundColor: 'red',
        borderRadius: 12,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
});

