import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ref, set, onValue, update, remove } from "firebase/database";
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';
import { getDownloadURL, ref as ref1, listAll } from 'firebase/storage';
import { storage } from '../../Components/config';

export default function BusinessCreatePromotionMain() {
  const navigation = useNavigation();
  const [selectedFoodPromotion, setSelectedFoodPromotion] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [images, setImages] = useState({});

  const [promotions, setPromotions] = useState([]);

  const fetchImages = async (foodmenus) => {
    for (let food of foodmenus) {
      const listRef = ref1(storage, `food/${food.id}`);
      const imageList = await listAll(listRef);
      let downloadURLs = await Promise.all(imageList.items.map((imageRef) => getDownloadURL(imageRef)));
      if (downloadURLs.length > 0) {
        downloadURLs = downloadURLs.pop();
      }
      setImages((prevImages) => ({
        ...prevImages,
        [food.id]: downloadURLs,
      }));
    }
  }

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
        const selectedFoodPromotionRef = snapshot.val();
        setSelectedFoodPromotion(selectedFoodPromotionRef);
        const foodmenusArray = Object.keys(selectedFoodPromotionRef).map((id) => ({
          id,
          ...selectedFoodPromotionRef[id],
        }));
        fetchImages(foodmenusArray);
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
                <View style={styles.circularCard}>
                  <Image source={{ uri: images[item.id] }} style={{ width: 120, height: 120, borderRadius: 60 }} />
                </View>
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
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
    color: 'white',
  },
  dataContainer: {
    // Styles for data container
    padding: 10,
  },
  dataTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
    marginTop: 15,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
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
    color: 'black',
  },
  itemPrice: {
    fontSize: 18,
    color: 'black',
  },
  button: {
    color: 'white', // Text color
    fontSize: 20, // Text font size
    fontWeight: 'bold', // Text font weight
    backgroundColor: 'green', // Background color
    padding: 10, // Padding around the text
    borderRadius: 30, // Border radius for rounded corners
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center', // Center text horizontally
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  circularCard: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white', // Customize the color of the circular card
    margin: 10,
  }
});