import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';
import { getDownloadURL, ref as ref1, listAll } from 'firebase/storage';
import { storage } from '../../Components/config';

const StudentHomePromotion = () => {
  const navigation = useNavigation();
  const [selectedFoodPromotion, setSelectedFoodPromotion] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [images, setImages] = useState({});

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
    const selectedFoodPromotionRef = ref(db, 'selectFoodPromotion');

    const selectedFoodPromotionListener = onValue(selectedFoodPromotionRef, (snapshot) => {
      if (snapshot.exists()) {
        const selectedFoodPromotionData = snapshot.val();
        setSelectedFoodPromotion(selectedFoodPromotionData);
        setDataFetched(true); // Set dataFetched to true here
        const foodmenusArray = Object.keys(selectedFoodPromotionData).map((id) => ({
          id,
          ...selectedFoodPromotionData[id],
        }));
        fetchImages(foodmenusArray);
      }
    });

    return () => {
      selectedFoodPromotionListener();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Food Promotions</Text>
      {dataFetched && (
        <ScrollView style={styles.dataContainer}>
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
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'maroon',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  dataContainer: {
    // Styles for data container
    width: '90%',
    left: 18
  },
  dataTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 20,
    marginVertical: 8,
    borderRadius: 15,
    backgroundColor: '#FFA500',
    elevation: 2,
    marginTop: 15,
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
    backgroundColor: 'blue',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  circularCard: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white', // Customize the color of the circular card
    margin: 10,
  },
  contentContainer: {
    alignItems: 'center',
  },
});

export default StudentHomePromotion;