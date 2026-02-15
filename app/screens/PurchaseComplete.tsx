import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons

type PurchaseCompleteProps = {
  onGoBack: () => void; // Function to go back to the empty Cart
};

const PurchaseComplete: React.FC<PurchaseCompleteProps> = ({ onGoBack }) => {

  const handleGoBack = () => {
    onGoBack(); // Navigate back to the Cart screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Purchase Complete!</Text>
      <Text style={styles.message}>Your book will be delivered soon.</Text>
      <TouchableOpacity style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Go Back to Cart</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#0B0F4C',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    color: '#0B0F4C',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#0B0F4C',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PurchaseComplete;
