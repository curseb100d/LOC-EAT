import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, Image } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { ref, onValue } from 'firebase/database';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';
import { getDownloadURL, ref as ref1, listAll } from 'firebase/storage';
import { storage } from '../../Components/config';
import { Ionicons } from '@expo/vector-icons';

export default function StudentHomeView() {
  const [promotions, setPromotions] = useState([]);
  const [foodmenus, setFoodMenu] = useState([]);
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
      if (snapshot.exists()) {
        const foodmenusData = snapshot.val();
        const foodmenusArray = Object.keys(foodmenusData).map((id) => ({
          id,
          ...foodmenusData[id],
        }));
        setFoodMenu(foodmenusArray);
        fetchImages(foodmenusArray);
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

  const getGreeting = () => {
    const currentHour = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
      hourCycle: 'h23',
      hour: 'numeric',
    });

    let greeting = '';

    if (parseInt(currentHour, 10) >= 5 && parseInt(currentHour, 10) < 12) {
      greeting = 'Good Morning';
    } else if (parseInt(currentHour, 10) >= 12 && parseInt(currentHour, 10) < 18) {
      greeting = 'Good Afternoon';
    } else {
      greeting = 'Good Evening';
    }

    return greeting;
  };

  const renderGreetingIcon = () => {
    const currentHour = new Date().toLocaleString('en-US', {
      timeZone: 'Asia/Manila',
      hourCycle: 'h23',
      hour: 'numeric',
    });

    if (parseInt(currentHour, 10) >= 5 && parseInt(currentHour, 10) < 12) {
      return <Ionicons name="ios-sunny" size={24} color="white" />;
    } else if (parseInt(currentHour, 10) >= 12 && parseInt(currentHour, 10) < 18) {
      return <Ionicons name="ios-cafe" size={24} color="white" />;
    } else {
      return <Ionicons name="ios-moon" size={24} color="white" />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.greetingContainer}>
        {renderGreetingIcon()}
        <Text style={styles.greetingText}>{getGreeting()}</Text>
      </View>
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
                  <Image source={{ uri: images[item.id] }} style={{ width: 120, height: 120, borderRadius: 60 }} />
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.foodName}</Text>
                  <Text style={styles.itemPrice}>{`Price: $${item.price}`}</Text>
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
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  greetingText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
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
