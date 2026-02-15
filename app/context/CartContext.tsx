// CartContext.tsx
import React, { createContext, useState, ReactNode, FC, useEffect } from 'react';
import { Book } from '../../type';
import { onValue, ref, set } from 'firebase/database';
import { FIREBASE_DB } from '../../Firebaseconfig';
import { useAuth } from '../../useAuth'; 

export interface CartItem {
    book: Book;
    quantity: number;
}

interface CartContextType {
    cartItems: CartItem[];
    setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    addToCart: (book: Book) => void;
    increaseQuantity: (id: string) => void;
    decreaseQuantity: (id: string) => void;
    removeFromCart: (id: string) => void;
    proceedToCheckout: () => number;
    clearCart: () => void;
    currentScreen: string;
    setCurrentScreen: (screen: string) => void;
}

export const CartContext = createContext<CartContextType | undefined>(
    undefined
);

interface CartProviderProps {
    children: ReactNode;
}

const CartProvider: FC<CartProviderProps> = ({ children }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [currentScreen, setCurrentScreen] = useState<string>("Cart"); 
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const cartRef = ref(FIREBASE_DB, `carts/${user.uid}`);
            onValue(cartRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    setCartItems(data.items || []);
                } else {
                    setCartItems([]);
                }
            });
        }
    }, [user]);

    const saveCartToFirebase = (updatedCartItems: CartItem[]) => {
        if (user) {
            const cartRef = ref(FIREBASE_DB, `carts/${user.uid}`);
            set(cartRef, { items: updatedCartItems });
        }
    };
    
    const addToCart = (book: Book) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.book.id === book.id);
            let updatedCartItems;
            if (existingItem) {
                updatedCartItems = prevItems.map(item => 
                    item.book.id === book.id 
                    ? { ...item, quantity: item.quantity + 1 } 
                    : item
                );
            } else {
                updatedCartItems = [...prevItems, { book, quantity: 1 }];
            }
            saveCartToFirebase(updatedCartItems);
            return updatedCartItems;
        });
    };

    const increaseQuantity = (id: string) => {
        setCartItems((prevItems) => {
            const updatedCartItems = prevItems.map(item =>
                item.book.id === id ? { ...item, quantity: item.quantity + 1 } : item
            );
            saveCartToFirebase(updatedCartItems);
            return updatedCartItems;
        });
    };

    const decreaseQuantity = (id: string) => {
        setCartItems((prevItems) => {
            const existingItem = prevItems.find(item => item.book.id === id);
            let updatedCartItems;
            if (existingItem && existingItem.quantity > 1) {
                updatedCartItems = prevItems.map(item =>
                    item.book.id === id ? { ...item, quantity: item.quantity - 1 } : item
                );
            } else {
                updatedCartItems = prevItems.filter(item => item.book.id !== id);
            }
            saveCartToFirebase(updatedCartItems);
            return updatedCartItems;
        });
    };

    const removeFromCart = (id: string) => {
        console.log('Removing item with ID:', id);
        setCartItems(prevItems => {
            const updatedCartItems = prevItems.filter(item => item.book.id !== id);
            saveCartToFirebase(updatedCartItems);
            return updatedCartItems;
        });
    };

   const proceedToCheckout = () => {
        const totalPrice = cartItems.reduce((total, item) => total + (item.quantity * Number(item.book.price)), 0);
        return totalPrice;
    };

    const clearCart = () => {
        setCartItems([]);
        if (user) {
            const cartRef = ref(FIREBASE_DB, `carts/${user.uid}`);
            set(cartRef, { items: [] });
        }
    };

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            addToCart, 
            increaseQuantity, 
            decreaseQuantity, 
            removeFromCart,
            proceedToCheckout,
            clearCart,
            currentScreen,
            setCurrentScreen,
            setCartItems,
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartProvider;
