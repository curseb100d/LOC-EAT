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
        <TouchableOpacity onPress={() => filterByLocation('Back Gate')}>
          <Text style={styles.buttonText}>Back Gate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByLocation('Front Gate')}>
          <Text style={styles.buttonText}>Front Gate</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByLocation('Canteen')}>
          <Text style={styles.buttonText}>Canteen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => filterByLocation('')}>
          <Text style={styles.buttonText}>Clear</Text>
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
                <Text>{`Status: ${store.status}`}</Text>
                <Text>{`Time Open: ${store.timeOpen}`}</Text>
                <Text>{`Time Open: ${store.location}`}</Text>
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
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  storeContainer: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 3,
  },
  storeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
  },
});

export default StudentStoreView;
