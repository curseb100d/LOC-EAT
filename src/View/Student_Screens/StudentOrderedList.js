import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { db_auth } from '../../Components/config';
import {
  getAuth,
} from 'firebase/auth';

function StudentOrderedList() {
  const [ordersWithStatus, setOrdersWithStatus] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    fetchStatusFromFirebase();
  }, [auth]);

  const fetchStatusFromFirebase = async () => {
    try {
      const userEmail = db_auth.currentUser.email;
      // Fetch data from your Realtime Firebase database using axios
      axios.get('https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood.json')
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
  
          const ordersArrayMapped = Object.keys(data).map((id) => {
            if ( userEmail === data[id].userEmail){
              tempFoodMenu = {
                id,
                ...data[id],
              }

              return tempFoodMenu; 
            } else {
              return undefined;
            }
          });
          const ordersArray = ordersArrayMapped.filter((item) => {return (item) ? true : false});
          setOrdersWithStatus(ordersArray);
        }
      })

      
    } catch (error) {
      console.error('Error fetching data from Firebase:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Orders</Text>
      <FlatList
        data={ordersWithStatus}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderDetails}>Order Details</Text>
            <Text style={styles.label}>Payment Method:</Text>
            <Text style={styles.value}>{item.paymentMethod}</Text>
            <Text style={styles.label}>Pick Up Time:</Text>
            <Text style={styles.value}>{item.pickUpTime}</Text>
            {item.foodDetails && item.foodDetails.map((foodItem, foodIndex) => (
              <View key={foodIndex} style={styles.foodItem}>
                <Text style={styles.foodName}>{foodItem.foodName}</Text>
                <Text style={styles.foodPrice}>Price: ₱{foodItem.price}</Text>
                <Text style={styles.foodQuantity}>Quantity: {foodItem.quantity}</Text>
              </View>
            ))}
            <View style={styles.statusContainer}>
              <Text style={styles.label}>Estimated Time: {item.pickUpTime}</Text>
            </View>
            <View style={styles.statusContainer}>
              <Text style={styles.label}>Status: {item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'maroon', // Attractive color
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFF', // White text
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFD700', // Golden color
    padding: 16,
    margin: 10,
    borderRadius: 15,
    elevation: 2,
    height: 500,
  },
  orderDetails: {
    fontSize: 24,
    color: 'black', // Dark text
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginVertical: 8,
    marginLeft:15,
    marginTop:15,
  },
  value: {
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
    marginLeft:15,
  },
  foodItem: {
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    marginRight:235,
    marginBottom:10,
  },
  foodPrice: {
    fontSize: 16,
    color: 'black',
    marginRight:215,
    marginBottom:10,
  },
  foodQuantity: {
    fontSize: 16,
    color: 'black',
    marginRight:215,
    marginBottom:20,
  },
  foodCarouselContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statusContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    bottom: 35,
  },
  acceptedOrderText: {
    fontSize: 24,
    color: 'maroon',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    textAlign:'center',
    marginBottom:35,
  },
});

export default StudentOrderedList;
