import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ref, set, onValue, update, remove } from "firebase/database";
import { db } from '../../Components/config';
import { firebase } from '../../Components/config';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

export default function BusinessCreatePromotionMain() {
  const navigation = useNavigation();
  const [selectedFoodPromotion, setSelectedFoodPromotion] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  const [foodDiscountDescription, setFoodDiscountDescription] = useState('');
  const [discount, setDiscount] = useState(0);
  const [storeName, setStoreName] = useState('');
  const [location, setLocation] = useState('');
  const [promotions, setPromotions] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [foodName, setFoodName] = useState('');
  const [price, setPrice] = useState(0);
  const [discountPercentage, setDiscountPercentage] = useState('');

  useEffect(() => {
    const promotionsRef = ref(db, 'promotions');
    const selectedFoodPromotionRef = ref(db, 'selectFoodPromotion');

    const promotionsListener = onValue(promotionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const promotionsData = snapshot.val();
        setPromotions(promotionsData);
        setDataFetched(true); // Set dataFetched to true here
      }
    });

    const selectedFoodPromotionListener = onValue(selectedFoodPromotionRef, (snapshot) => {
      if (snapshot.exists()) {
        const selectedFoodPromotionData = snapshot.val();
        setSelectedFoodPromotion(selectedFoodPromotionData);
      }
    });

    return () => {
      promotionsListener();
      selectedFoodPromotionListener();
    };
  }, []);


  const handleEditPromotionClick = () => {
    navigation.navigate('BusinessCreatePromotionAdd');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Promotions</Text>
      {dataFetched && (
        <ScrollView style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Promotions:</Text>
          <FlatList
            data={promotions}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemName}>{`${item.discount}% off for ${item.daysDifference} days`}</Text>
                <Text style={styles.itemPrice}>{item.foodDiscountDescription}</Text>
                <Text style={styles.itemPrice}>{item.storeName}</Text>
                <Text style={styles.itemPrice}>{item.location}</Text>
              </View>
            )}
          />

          <Text style={styles.dataTitle}>Selected Food Promotions:</Text>
          <FlatList
            data={selectedFoodPromotion}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.foodName}</Text>
                <Text style={styles.itemPrice}>{`Original Price: ${item.price}`}</Text>
                <Text style={styles.itemPrice}>{`Discount: ${item.discountPercentage}`}</Text>
                <Text style={styles.itemPrice}>{`Discount Price: ${item.discountedPrice}`}</Text>
              </View>
            )}
          />
        </ScrollView>
      )}
      <TouchableOpacity style={styles.button} onPress={handleEditPromotionClick}>
        <Text style={styles.buttonText}>Add Promotion</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  dataContainer: {
    // Styles for data container
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: 'white',
    elevation: 2,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: '#555',
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});