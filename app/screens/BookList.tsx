import React from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: string;
  picture: string;
}

interface BooksListProps {
  books: Book[];
  category: string;
  onGoBack: () => void;
}

const BooksList: React.FC<BooksListProps> = ({ books, category, onGoBack }) => {
  const renderItem = ({ item }: { item: Book }) => (
    <View style={styles.bookItem}>
      <Image source={{ uri: item.picture }} style={styles.bookImage} />
      <View style={styles.bookDetails}>
        <Text style={styles.bookCategory}>{item.category}</Text>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookPrice}>{item.price} ฿</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onGoBack} style={styles.backIconContainer}>
          <Ionicons name="arrow-back" size={24} color="#0B0F4C" />
        </TouchableOpacity>
        <Text style={styles.header}>{category}</Text>
      </View>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.fullBookList}
        showsVerticalScrollIndicator={false} // Optional: Hide the scroll indicator
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    padding: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B0F4C",
    flex: 1,
    textAlign: "left",
  },
  backIconContainer: {
    padding: 10,
    paddingRight: 20,
  },
  bookItem: {
    flexDirection: "row",
    width: "100%",
    height: 140,
    marginVertical: 16,
    backgroundColor: "#D1D4F9",
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  bookImage: {
    width: 100,
    height: 120,
    resizeMode: "contain",
    marginRight: 10,
    marginTop: 10,
    padding: 10,
    justifyContent: "center",
  },
  bookDetails: {
    width: width,
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#0B0F4C",
    padding: 10,
  },
  bookCategory: {
    fontSize: 12,
    color: "#fff",
    marginBottom: 4,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 4,
  },
  bookPrice: {
    fontSize: 18,
    color: "#D1D4F9",
    fontWeight: "bold",
  },
  fullBookList: {
    paddingHorizontal: 10,
  },
});

export default BooksList;
