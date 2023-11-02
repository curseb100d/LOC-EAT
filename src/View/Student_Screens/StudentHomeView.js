import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { ref, onValue } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';

export default function StudentHomeView() {
  const [promotions, setPromotions] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const promotionsRef = ref(db, 'promotions');

    const promotionsListener = onValue(promotionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const promotionsData = snapshot.val();
        setPromotions(promotionsData);
        setDataFetched(true); // Set dataFetched to true once data is available
      }
    });

    return () => {
      promotionsListener(); // Clean up the listener when the component unmounts
    };
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        // Navigate to 'StudentHomePromotion' when an item is pressed
        navigation.navigate('StudentHomePromotion', { /* pass any params you need */ });
      }}
    >
      <Text style={styles.itemName}>{`${item.discount}% off for ${item.daysDifference} days`}</Text>
      <Text style={styles.itemPrice}>{item.foodDiscountDescription}</Text>
      <Text style={styles.itemPrice}>{item.storeName}</Text>
      <Text style={styles.itemPrice}>{item.location}</Text>
    </TouchableOpacity>
  );

  const navigation = useNavigation(); // Get the navigation object

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Promo</Text>
      {dataFetched && (
        <View style={styles.dataContainer}>
          <Carousel
            data={promotions}
            renderItem={renderItem}
            sliderWidth={300} // Adjust the width as needed
            itemWidth={300}   // Adjust the width as needed
          />
        </View>
      )}
      <Text style={styles.header}>Recommendations</Text>
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
    marginBottom: 20,
    textAlign: 'center',
    color: 'white',
  },
  dataContainer: {
    // Styles for data container
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    color: 'black',
  },
});