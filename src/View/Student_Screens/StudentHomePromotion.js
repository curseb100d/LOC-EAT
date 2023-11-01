import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';

const StudentHomePromotion = () => {
  const navigation = useNavigation();
  const [selectedFoodPromotion, setSelectedFoodPromotion] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const selectedFoodPromotionRef = ref(db, 'selectFoodPromotion');

    const selectedFoodPromotionListener = onValue(selectedFoodPromotionRef, (snapshot) => {
      if (snapshot.exists()) {
        const selectedFoodPromotionData = snapshot.val();
        setSelectedFoodPromotion(selectedFoodPromotionData);
        setDataFetched(true); // Set dataFetched to true here
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
    </View>
  );
}

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

export default StudentHomePromotion;