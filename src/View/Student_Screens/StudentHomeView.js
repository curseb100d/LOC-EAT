import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { ref, onValue } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';

export default function StudentHomeView() {
  const [promotions, setPromotions] = useState([]);
  const [foodmenus, setFoodMenu] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    const promotionsRef = ref(db, 'promotions');
    const foodmenuRef = ref(db, 'foodmenu');

    const promotionsListener = onValue(promotionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const promotionsData = snapshot.val();
        setPromotions(promotionsData);
        setDataFetched(true); // Set dataFetched to true once data is available
      }
    });

    const foodmenuListener = onValue(foodmenuRef, (snapshot) => {
      if (snapshot.exists()) {
        const foodmenusData = snapshot.val();
        const foodmenusArray = Object.keys(foodmenusData).map((id) => ({
          id,
          ...foodmenusData[id],
        }));
        setFoodMenu(foodmenusArray);
      }
    });

    return () => {
      promotionsListener(); // Clean up the promotions listener when the component unmounts
      foodmenuListener(); // Clean up the foodmenu listener when the component unmounts
    };
  }, []);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        // Navigate to 'StudentHomePromotion' when an item is pressed
        navigation.navigate('StudentHomePromotion', { selectedItem: item });
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
      {dataFetched && (
        <View style={styles.dataContainer}>
          <FlatList
            data={foodmenus}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <Text style={styles.itemName}>{item.foodName}</Text>
                <Text style={styles.itemPrice}>{`Price: $${item.price}`}</Text>
                <Text style={styles.itemPrice}>{item.location}</Text>
                {/* Add more details as needed */}
              </View>
            )}
            // Sort the recommendations by discount in descending order
            // Adjust the sorting logic based on your data structure
            // sortBy={(item) => -item.discount}
          />
        </View>
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
