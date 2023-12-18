import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const StudentStoreView = () => {
  const [storeData, setStoreData] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        const response = await axios.get('https://loc-eat-ddb73-default-rtdb.firebaseio.com/Business%20user.json');
        const data = response.data;
        if (data) {
          const stores = Object.values(data);

          const extractedData = stores.map((store) => ({
            storeName: store.businessName,
            status: store.status,
            timeOpen: store.timeOpen,
            email: store.email,
            firstName: store.firstName,
            lastName: store.lastName,
            location: store.location,
            schedule: store.schedule,
          }));

          setStoreData(extractedData);
        } else {
          console.error('No store data found.');
        }
      } catch (error) {
        console.error('Error fetching store data:', error);
      }
    };

    fetchStoreData();
  }, []);

  // Function to filter by location
  const filterByLocation = (location) => {
    setSelectedLocation(location);
  };

  // Function to handle search input changes
  const handleSearch = (text) => {
    setSearchInput(text);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Store Information</Text>

      {/* Search input field */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search"
        value={searchInput}
        onChangeText={handleSearch}
      />

      {/* Buttons to filter by location */}
      <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={() => filterByLocation('')}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByLocation('Back Gate')}>
          <Text style={styles.buttonText}>Back Gate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByLocation('Front Gate')}>
          <Text style={styles.buttonText}>Front Gate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByLocation('Canteen')}>
          <Text style={styles.buttonText}>Canteen</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
        {storeData
          .filter((store) => {
            const storeName = (store.storeName || '').toLowerCase();
            const location = (store.location || '').toLowerCase();
            const search = searchInput.toLowerCase();

            return (!selectedLocation || store.location === selectedLocation) &&
              (storeName.includes(search) || location.includes(search));
          })
          .map((store, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                // Navigate to the "DetailedStore" screen with the store data
                navigation.navigate('StudentDetailedStore', { storeData: store });
              }}
            >
              <View style={styles.storeContainer}>
                <Text style={styles.storeName}>{store.storeName}</Text>
                {/* <Text>{`Status: ${store.status}`}</Text> */}
                <Text>{`Time Open: ${store.timeOpen}`}</Text>
                <Text>{`Location: ${store.location}`}</Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'maroon',
    padding: 16,
  },
  heading: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color:'white',
  },
  storeContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFA500',
    elevation: 2,
    marginBottom: 10,
    paddingRight:10,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    marginBottom:15,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    marginBottom: 10,
    color:'black',
    borderRadius:18,
    backgroundColor:'white',
  },
});

export default StudentStoreView;
