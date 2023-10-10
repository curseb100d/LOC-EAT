import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import Axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../../Context/CartContext';

export default function StudentSearchView() {
  const [data, setData] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { addToCart } = useCart();
  const navigation = useNavigation();

  const fetchData = async () => {
    try {
      const response = await Axios.get(
        'https://loc-eat-ddb73-default-rtdb.firebaseio.com/foodmenu.json'
      );
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addToCartAndNavigate = (item) => {
    addToCart(item);
    navigation.navigate('Cart');
  };

  const filterDataBySearch = () => {
    if (!data) {
      return <Text>Loading...</Text>;
    }

    if (!searchQuery) {
      const firstTwoData = Object.keys(data).slice(0, 2);

      return firstTwoData.map((key) => {
        const item = data[key];
        return (
          <View key={key} style={styles.card}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {/* White square shape */}
              <View style={styles.whiteSquare}></View>
              <Image source={{ uri: item.imageUrl }} style={{ width: 150, height: 100, marginRight: 10 }} />
              <View>
                <Text style={{ top: 35, left: 12, fontWeight: 'bold', fontSize: 25, color: 'black' }}>
                  {item.price}
                </Text>
                <Text style={{ top: -40, left: 12, fontWeight: 'bold', fontSize: 25, color: 'black' }}>
                  {item.name}
                </Text>
                <Text style={{ top: 5,left: 12, fontWeight: 'bold', fontSize: 25, color: 'black' }}>
                  {item.type}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => addToCartAndNavigate(item)} style={styles.addButton}>
              <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
          </View>
        );
      });
    }

    // Filter data based on search query
    const filteredData = Object.keys(data).filter((key) => {
      const item = data[key];
      return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    if (filteredData.length === 0) {
      return <Text>No results found</Text>;
    }

    const firstTwoMatchingData = filteredData.slice(0, 2);

    return firstTwoMatchingData.map((key) => {
      const item = data[key];
      return (
        <View key={key} style={styles.card}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.whiteSquare}></View>
            <Image source={{ uri: item.imageUrl }} style={{ width: 150, height: 100, marginRight: 10 }} />
            <View>
              <Text style={{ top: 35, left: 12, fontWeight: 'bold', fontSize: 25, color: 'black' }}>
                {item.price}
              </Text>
              <Text style={{ top: -40, left: 12, fontWeight: 'bold', fontSize: 25, color: 'black' }}>
                {item.name}
              </Text>
              <Text style={{ top: 5, left: 12, fontWeight: 'bold', fontSize: 25, color: 'black' }}>
                {item.type}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => addToCartAndNavigate(item)} style={styles.addButton}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const SmallCard = () => (
    <View style={styles.smallCard}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white' }}>
          x1
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'white', textAlign: 'right' }}>
            Total Calculated: 
          </Text>
          <Text style={{ fontWeight: 'bold', fontSize: 20, color: 'yellow' }}> ₱0</Text>
        </View>
      </View>
    </View>
  );

  const handleButtonClick = () => {
    // Add your logic for what should happen when the button is clicked here
    // For example, you can navigate to another screen or perform some other action.
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for a food item"
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text)}
      />
      {filterDataBySearch()}
      <SmallCard />
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => handleButtonClick()}
      >
        <Text style={[styles.reviewButtonText, {textAlign:'center', marginTop:2}]}>Review</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'maroon',
    flex: 1,
  },
  searchBar: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25,
    backgroundColor: 'white',
    margin: 10,
  },
  card: {
    width: 345,
    borderWidth: 2,
    height: 140,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 10,
    left: 14,
    margin: 10,
    backgroundColor: '#FFAD31',
    elevation: 5,
  },
  whiteSquare: {
    backgroundColor: 'white',
    width: 150, // Adjust the width as needed
    height: 117, // Adjust the height as needed
    borderRadius: 15,
    marginRight: -150,
  },
  addButton: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: 102,
    right: 5,
    backgroundColor: 'maroon',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'maroon', // Add a black border color
    borderWidth: 1, // Add a border width
  },
  buttonText: {
    fontSize: 20,
    color: 'white', // Change the color to yellow
    fontWeight: 'bold',
  },
  smallCard: {
    width: 345,
    left: 13,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: '#207D00',
    elevation: 5,
  },
  reviewButton: {
    position: 'absolute',
    width: 150,
    height: 35,
    bottom: 30,
    right: 10,
    backgroundColor: 'maroon',
    padding: 1,
    borderRadius: 100,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 0,
    backgroundColor: 'white',
  },
  reviewButtonText: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
