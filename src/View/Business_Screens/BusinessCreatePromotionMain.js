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

  const [promotions, setPromotions] = useState([]);

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
          <View>
            {promotions.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemName}>{`${item.discount}% off for ${item.daysDifference} days`}</Text>
                <Text style={styles.itemPrice}>{item.foodDiscountDescription}</Text>
                <Text style={styles.itemPrice}>{item.storeName}</Text>
                <Text style={styles.itemPrice}>{item.location}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.dataTitle}>Selected Food Promotions:</Text>
          <View>
            {selectedFoodPromotion.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.foodName}</Text>
                <Text style={styles.itemPrice}>{`Original Price: ${item.price}`}</Text>
                <Text style={styles.itemPrice}>{`Discount: ${item.discountPercentage}`}</Text>
                <Text style={styles.itemPrice}>{`Discount Price: ${item.discountedPrice}`}</Text>
              </View>
            ))}
          </View>
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
    backgroundColor: 'maroon',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color:'white',
  },
  dataContainer: {
    // Styles for data container
    padding:10,
  },
  dataTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color:'white',
    marginTop:15,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: 16,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFA500',
    elevation: 2,
    marginBottom: 10,
  },
  itemName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color:'black',
  },
  itemPrice: {
    fontSize: 18,
    color:'black',
  },
  button: {
    color: 'white', // Text color
    fontSize: 20, // Text font size
    fontWeight: 'bold', // Text font weight
    backgroundColor: 'green', // Background color
    padding: 10, // Padding around the text
    borderRadius: 15, // Border radius for rounded corners
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});