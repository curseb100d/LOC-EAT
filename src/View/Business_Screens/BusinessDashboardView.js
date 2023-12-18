import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function BusinessDashboardView() {
  const [state, setState] = useState({
    sales: 0,
    orders: 0,
    customers: 0,
    revenue: 0,
    popularOrders: [],
  });
  const navigation = useNavigation();

  const calculateDashboardData = async () => {
    try {
      const response = await axios.get('https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood.json');

      if (response.status === 200) {
        const data = response.data;

        // Initialize variables to accumulate values
        let totalSales = 0;
        let totalOrders = 0;
        let popularOrders = [];

        for (const orderId in data) {
          const order = data[orderId];

          // Check if an order has the required fields (foodDetails, paymentMethod, pickUpTime)
          if (order.foodDetails && order.paymentMethod && order.pickUpTime) {
            // Extract relevant information
            const price = order.foodDetails.reduce((total, item) => total + item.price, 0);
            const quantity = order.foodDetails.reduce((total, item) => total + item.quantity, 0);
            const foodDetails = order.foodDetails;

            // Accumulate data
            totalSales += price;
            totalOrders += quantity;

            // For each food item in the order, add it to the popularOrders array
            for (const foodItem of foodDetails) {
              // Find if this food item already exists in the popularOrders array
              const existingItem = popularOrders.find((item) => item.foodName === foodItem.foodName);

              if (existingItem) {
                // If it exists, add the quantity to the existing item
                existingItem.quantity += foodItem.quantity;
              } else {
                // If it doesn't exist, add a new item to the popularOrders array
                popularOrders.push({ foodName: foodItem.foodName, quantity: foodItem.quantity });
              }
            }
          }
        }

        // Sort popularOrders based on the quantity in descending order
        popularOrders.sort((a, b) => b.quantity - a.quantity);

        setState({
          ...state,
          sales: totalSales,
          orders: totalOrders,
          popularOrders: popularOrders,
          // Update other properties here
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Use useEffect to fetch data and calculate the dashboard when the component mounts.
  useEffect(() => {
    calculateDashboardData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dashboard</Text>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.card}>
          <Text style={styles.text}>Total Sales</Text>
          <Text style={styles.value}>{state.sales}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.text}>Total Orders</Text>
          <Text style={styles.value}>{state.orders}</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.heading}>Popular Orders</Text>
          {state.popularOrders.map((item) => (
            <Text key={item.foodName} style={styles.text2}>{item.foodName}: {item.quantity}</Text>
          ))}
        </View>
      </ScrollView>
      <View style={styles.bottomLeft}>
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('BusinessCalendarScreen')}>
          <View style={styles.rowContainer}>
            <FontAwesome name="calendar" size={30} color="black" style={styles.icon} />
            <Text style={styles.buttonText}>Calendar</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: 'maroon',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
    color: 'white',
    marginLeft: 20,
  },
  scrollViewContent: {
    padding: 8,
  },
  card: {
    backgroundColor: 'white',
    padding: 10,
    margin: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  text: {
    fontSize: 24,
    color: 'maroon',
    fontWeight: 'bold',
  },
  text2: {
    fontSize: 18,
    color: 'maroon',
  },
  value: {
    fontSize: 18,
    color: 'maroon',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'maroon',
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 10,
  },
  calendarButton: {
    backgroundColor: 'maroon',
    borderRadius: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 8,
    fontSize: 18,
    color: 'maroon',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

};

export default BusinessDashboardView;
