import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyDSRobmhannMR_R668WccMO12mjBEgBQ_g",
    authDomain: "bookstore-230f2.firebaseapp.com",
    databaseURL: "https://bookstore-230f2-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "bookstore-230f2",
    storageBucket: "bookstore-230f2.firebasestorage.app",
    messagingSenderId: "83272425319",
    appId: "1:83272425319:web:c98abf52cebb19785199c2",
    measurementId: "G-NQ9KZ60H7S"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export const FIREBASE_DB = getDatabase(FIREBASE_APP);
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);
