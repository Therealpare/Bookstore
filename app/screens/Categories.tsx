import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, StyleSheet, Image, TouchableOpacity, Dimensions, ImageBackground, } from "react-native";
import { FIREBASE_DB } from "../../Firebaseconfig";
import { ref, onValue } from "firebase/database";
import { Entypo } from "@expo/vector-icons";
import BookDetails from "./BookDetails";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

type Book = {
    id: string;
    title: string;
    author: string;
    category: string;
    publisher: string;
    ISBN: string;
    stock: number;
    price: string;
    description: string;
    picture: string; 
};

const categories = [
    { id: "1", name: "Non-Fiction" },
    { id: "2", name: "Classic" },
    { id: "3", name: "Romance" },
    { id: "4", name: "Adventure" },
    { id: "5", name: "Philosophical" },
    { id: "6", name: "Historical" },
    { id: "7", name: "Sci-Fi" },
    { id: "8", name: "Drama" },
    { id: "9", name: "Horror" },
    { id: "10", name: "Others" },
];

const Categories = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);
    const [showBooks, setShowBooks] = useState(false);

    useEffect(() => {
      const booksRef = ref(FIREBASE_DB, "books");

      onValue(booksRef, (snapshot) => {
        const data = snapshot.val();
        if (!data) return;

        const booksArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key], 
        }));

          setBooks(booksArray);
          setFilteredBooks(booksArray);
      });
    }, []);

    const handleSearch = (query: string) => {
        setSearchQuery(query);

        const results = books.filter(
        (book) =>
            book.title.toLowerCase().includes(query.toLowerCase()) ||
            book.author.toLowerCase().includes(query.toLowerCase()) ||
            book.publisher.toLowerCase().includes(query.toLowerCase()) ||
            book.ISBN.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredBooks(results);
        setShowBooks(true);
    };

    const handleCategorySelect = (category: string) => {
        const results = books.filter(
            (book) => book.category.toLowerCase() === category.toLowerCase()
        );
        setFilteredBooks(results);
        setShowBooks(true);
    };

    if (selectedBook) {
        return (
        <BookDetails
            book={selectedBook}
            onGoBack={() => setSelectedBook(null)}
        />
        );
    }

    return (
        <View style={styles.container}> {showBooks && (
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => {
                    setShowBooks(false);
                    setSearchQuery("");
                    setFilteredBooks(books);
                }}
            >
            <View style={styles.backRow}>
                <Image source={require("../../assets/left.png")} 
                    style={styles.backIcon} 
                />
                <Text style={styles.backText}>Categories</Text>
            </View>
            </TouchableOpacity>
        )}

        <View style={styles.searchWrapper}>
            <Text style={styles.searchLabel}>Search</Text>

            <View style={styles.searchContainer}>
                <Entypo
                    name="magnifying-glass"
                    size={20}
                    color="#666"
                    style={styles.searchIcon}
                />
                <TextInput
                    style={styles.searchBar}
                    placeholder="Title/Publisher/Author/ISBN"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>
        </View>

        {showBooks ? (
            <FlatList
                key="BOOK_LIST"
                data={filteredBooks}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.bookItem}
                        onPress={() => setSelectedBook(item)}
                    >
                    <Image source={{ uri: item.picture }} style={styles.bookImage}/>

                    <View style={styles.bookDetailsCon}>
                        <View style={styles.bookDetails}>
                            <Text style={styles.bookTitle}>{item.title}</Text>
                            <Text style={styles.bookAuthor}>{item.author}</Text>
                            <Text style={styles.bookPublisher}>{item.publisher}</Text>
                        </View>

                        <View style={styles.stockContain}>
                            <Text style={styles.bookPrice}>{item.price} ฿</Text>
                            <Text style={styles.bookStock}>Stock: {item.stock}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No results found.</Text>
                    </View>
                }
            />
        ) : (
            <FlatList
                key="CATEGORY_GRID"
                data={categories}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.categoryCard}
                        onPress={() => handleCategorySelect(item.name)}
                    >
                    <ImageBackground
                        source={{
                        uri: "https://firebasestorage.googleapis.com/v0/b/bookstore-2abd0.appspot.com/o/bookstore.jpg?alt=media",
                        }}
                        style={styles.imageBackground}
                        imageStyle={styles.imageBackgroundStyle}
                    >
                        <LinearGradient
                        colors={[
                            "rgba(0,0,0,0.8)",
                            "rgba(84, 83, 83, 0.5)",
                            "rgba(0,0,0,0.3)",
                        ]}
                        style={styles.gradient}
                        >
                            <Text style={styles.categoryText}>{item.name}</Text>
                        </LinearGradient>
                    </ImageBackground>
                </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.categoryRow}
                />
            )}
        </View>
    );
};

export default Categories;

const styles = StyleSheet.create({
    searchWrapper: {
        marginBottom: 12,
    },

    searchLabel: {
        fontSize: 30,
        fontWeight: "bold",
        color: "#0B0F4C",
        marginBottom: 10,
        marginTop: 40,
    },

    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f2f2f2",
        paddingTop: 50,
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        backgroundColor: "#fff",
    },
    searchIcon: {
        marginRight: 8,
    },
    searchBar: {
        flex: 1,
        height: 40,
    },
    bookItem: {
        flexDirection: "row",
        paddingVertical: 10,
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
        alignItems: "center",
        justifyContent: "space-between",
    },
    bookImage: {
        width: 50,
        height: 75,
        marginRight: 16,
    },
    bookDetailsCon: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    bookDetails: {
        flex: 1,
    },
    bookTitle: {
        fontSize: 16,
        fontWeight: "bold",
    },
    bookAuthor: {
        fontSize: 14,
        color: "#111",
    },
    bookPublisher: {
        fontSize: 12,
        color: "#666",
    },
    stockContain: {
        flexDirection: "column",
    },
    bookPrice: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    bookStock: {
        fontSize: 12,
        fontWeight: "bold",
        color: "#252f90",
    },
    categoryRow: {
        justifyContent: "space-between",
        marginBottom: 10,
    },
    categoryCard: {
        width: width * 0.45,
        height: height * 0.15,
        borderRadius: 10,
        marginHorizontal: 6,
        marginVertical: 10,
        overflow: "hidden",
    },
    imageBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    imageBackgroundStyle: {
        borderRadius: 10,
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    categoryText: {
        color: "#000",
        fontSize: 20,
        fontWeight: "bold",
    },
    backRow: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: -14,
    },
    backIcon: {
        width: 20,
        height: 20,
        marginRight: 6,
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: "flex-start",
        marginBottom: -40,
    },
    backText: {
        color: "#000",
        fontWeight: "bold",
        fontSize: 14,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: "#666",
        fontWeight: "500",
    },
});



