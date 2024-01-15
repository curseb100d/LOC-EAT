import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { db_auth, db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';

import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';

function StudentNotificationView() {
  const navigation = useNavigation();
  const [ordersWithStatus, setOrdersWithStatus] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    fetchStatusFromFirebase();
  }, [auth]);
  
  const acknowledgeNotification = (food) => {
    if (food.hasNotification) {
        axios.patch(`https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood/${food.id}.json`, {hasNotification: false})
        .then(()=>{
            fetchStatusFromFirebase();
        });
    }
  };
  const fetchStatusFromFirebase = async () => {
    try {
      const userEmail = db_auth.currentUser.email;
      // Fetch data from your Realtime Firebase database using axios
      axios.get('https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood.json')
      .then((response) => {
        if (response.status === 200) {
          const data = response.data;
  
          const ordersArrayMapped = Object.keys(data).map((id) => {
            if ( userEmail === data[id].userEmail && data[id].hasNotification) {
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
      <Text style={styles.header}>{(ordersWithStatus.length) ? 'Your Notifications' : 'You have 0 notifications' }</Text>
      <Text style={styles.sectionTitle}>Orders</Text>
      <TouchableOpacity style={styles.backButton} onPress={()=> navigation.goBack('StudentAccountView')}>
        <Text style={styles.review}>BACK!</Text>
      </TouchableOpacity>
      <FlatList
        data={ordersWithStatus}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.acceptedOrderText}>Order Details</Text>
            <Text style={styles.paymentLabel}>Payment Method:</Text>
            <Text style={styles.paymentMethodValue}>{item.paymentMethod}</Text>
            <Text style={styles.pickLabel}>Estimated Time:</Text>
            <Text style={styles.pickValue}>{item.pickUpTime}</Text>      
            {item.foodDetails && item.foodDetails.map((foodItem, foodIndex) => (
              <View key={foodIndex} style={styles.foodItem}>
                <Text style={styles.foodName}>{foodItem.foodName}</Text>
                <Text style={styles.foodPrice}>Price: ${foodItem.price}</Text>
                <Text style={styles.foodQuantity}>Quantity: {foodItem.quantity}</Text>
              </View>
            ))}
            <View style={styles.statusContainer}>
              <Text style={styles.acceptedOrderText}>Status: {item.status}</Text>
            </View>
            <TouchableOpacity style={styles.seenButton} onPress={()=> acknowledgeNotification(item)}>
                <Text style={styles.review}>Seen</Text>
            </TouchableOpacity>
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
    backgroundColor: 'maroon',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  card: {
    backgroundColor: '#ffbf00',
    padding: 16,
    margin: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'white',
    elevation: 2,
    height: 450,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'maroon',
    marginTop: 10,
  },
  foodItem: {
    marginVertical: 10,
    bottom:35,
    justifyContent:'center',
    alignItems:'center',
    marginBottom:20,
  },
  foodName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'maroon',
  },
  foodPrice: {
    fontSize: 16,
    color: 'maroon',
  },
  foodQuantity: {
    fontSize: 16,
    color: 'maroon',
  },
  acceptedOrderText: {
    fontSize: 18,
    color: 'maroon',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    textAlign:'center',
    marginBottom:5,
  },
  statusContainer: {
    fontSize:18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusButton: {
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 14,
    color: 'white',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButtonText: {
    fontSize: 14,
    color: 'white',
  },
  paymentMethodValue: {
    fontSize: 18,
    color: 'maroon',
    bottom:25,
    left:175,
  },
  paymentLabel: {
    fontSize: 18,
    color: 'maroon',
    fontWeight:'bold',
    left:25,
  },
  pickLabel: {
    fontSize: 18,
    color: 'maroon',
    fontWeight:'bold',
    left:25,
    bottom:20,
  },
  pickValue: {
    fontSize: 18,
    color: 'maroon',
    bottom:44,
    left:150,
  },
  seenButton: {
    width: 320,
    height: 50,
    borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
    backgroundColor: 'green', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    width: 370,
    height: 50,
    borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
    backgroundColor: 'yellow', // Button background color
    justifyContent: 'center',
    alignItems: 'center',

  }
});

export default StudentNotificationView;
