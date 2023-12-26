import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { ref, onValue } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';
import { getDownloadURL, ref as ref1, listAll } from 'firebase/storage';
import { storage } from '../../Components/config';
import axios from 'axios';

export default function StudentHomeView() {
  const [promotions, setPromotions] = useState([]);
  const [foodmenus, setFoodMenu] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [images, setImages] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [promoObj, setPromoObj] = useState({});

  const fetchImages = async (foodmenus) => {
    for (let food of foodmenus) {
      const listRef = ref1(storage, `food/${food.id}`);
      const imageList = await listAll(listRef);
      let downloadURLs = await Promise.all(imageList.items.map((imageRef) => getDownloadURL(imageRef)));
      if (downloadURLs.length > 0) {
        downloadURLs = downloadURLs.pop();
        setImages((prevImages) => ({
          ...prevImages,
          [food.id]: downloadURLs,
        }));
        setIsLoading(true);
      }
    }
  }

  useEffect(() => {
    const promoRef= ref(db, 'selectFoodPromotion');
    const promotionsRef = ref(db, 'promotions');
    const foodmenuRef = ref(db, 'foodmenu');

    const promotionsListener = onValue(promotionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const promotionsData = snapshot.val();
        setPromotions(promotionsData);
        setDataFetched(true);
        const foodmenusArray = Object.keys(promotionsData).map((id) => ({
          id,
          ...promotionsData[id],
        }));
        fetchImages(foodmenusArray);
      }
    });

    const foodmenuListener = onValue(foodmenuRef, (snapshot) => {
      axios.get(promoRef + '.json')
        .then((response) => {
          if (response.data) {
            let promoDataObj = {};
            for (promo of response.data) {
              promoDataObj[promo.id] = promo;
              promoObj[promo.id] = promo;
            }
          }
        }).then(() => {
          if (snapshot.exists()) {
            const foodmenusData = snapshot.val();
            const foodmenusArray = Object.keys(foodmenusData).map((id) => {
              tempFoodMenu = {
                id,
                ...foodmenusData[id],
              }
              if (id in promoObj) {
                tempFoodMenu['price'] = promoObj[id].discountedPrice;
              }

              return tempFoodMenu;
            });
            setFoodMenu(foodmenusArray);
            fetchImages(foodmenusArray);
          }
        });
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
            sliderWidth={350} // Adjust the width as needed
            itemWidth={350}   // Adjust the width as needed
          />
        </View>
      )}
      <Text style={styles.header}>Recommendations for you</Text>
      {dataFetched && (
        <ScrollView>
          {dataFetched &&
            foodmenus.map((item) => (
              <View key={item.id} style={styles.itemContainerLeft}>
                <View style={styles.circularCard}>
                  {isLoading && (
                    <Image source={{ uri: images[item.id] }} style={{ width: 120, height: 120, borderRadius: 60 }} />
                  )}
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.foodName}</Text>
                  <Text style={styles.itemPrice}>{`Price: ₱${item.price}`}</Text>
                  <Text style={styles.itemPrice}>{item.location}</Text>
                </View>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    textAlign: 'center',
    color: 'white',
  },
  dataContainer: {
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 16,
    color: 'black',
  },
  circularCard: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white', // Customize the color of the circular card
    margin: 10,
  },
  itemContainerLeft: {
    flexDirection: 'row', // Set flexDirection to row
    alignItems: 'center', // Align items to the center
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFA500',
    elevation: 2,
    marginBottom: 10,
  },
  itemDetails: {
    marginLeft: 16, // Add margin to separate circularCard and itemDetails
    flex: 1, // Take the remaining space
  },
});
