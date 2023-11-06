import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, TouchableOpacity, Button } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

function BusinessFoodOrderView() {
  const [foodData, setFoodData] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [acceptedItems, setAcceptedItems] = React.useState([]);

  const navigation = useNavigation();  

  const fetchData = async () => {
    try {
      const response = await axios.get('https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood.json');

      if (response.status === 200) {
        const data = response.data;

        const foodArray = [];

        for (const orderId in data) {
          const order = data[orderId];

          if (order.foodDetails && order.paymentMethod && order.pickUpTime) {
            const foodDetails = order.foodDetails;

            const foodItems = foodDetails.map((foodItem) => ({
              foodName: foodItem.foodName,
              price: foodItem.price,
              quantity: foodItem.quantity,
            }));

            const orderData = {
              foodDetails: foodItems,
              paymentMethod: order.paymentMethod,
              pickUpTime: order.pickUpTime,
            };

            foodArray.push(orderData);
          }
        }

        const initialExpanded = {};
        foodArray.forEach((_, index) => {
          initialExpanded[index] = false;
        });
        setExpanded(initialExpanded);

        setFoodData(foodArray);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleExpansion = (index) => {
    setExpanded((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };

  const handleSelectItem = (index) => {
    if (selectedItems.includes(index)) {
      setSelectedItems(selectedItems.filter((item) => item !== index));
    } else {
      setSelectedItems([...selectedItems, index]);
    }
  };

  const handleAcceptItems = () => {
    const accepted = selectedItems.map((index) => foodData[index]);
    setSelectedItems([]);

    // Accumulate accepted items
    setAcceptedItems((prevAccepted) => [...prevAccepted, ...accepted]);
  };

  const handleRejectItems = () => {
    const itemsToReject = selectedItems.map((index) => foodData[index]);
  
    // Remove the rejected items from the Firebase database
    itemsToReject.forEach(async (item) => {
      try {
        // Send a DELETE request to remove the item by its key
        await axios.delete(`https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood.json`);
      } catch (error) {
        console.error('Error rejecting items:', error);
      }
    });
  
    setSelectedItems([]);
  
    // After removing the items, you might want to fetch the updated data to refresh the view.
    fetchData();
  };  

  const navigateToAcceptedOrders = () => {
    // Navigate to the BusinessAcceptedOrderScreen and pass acceptedItems as a route parameter
    navigation.navigate('BusinessAcceptedOrderScreen', { accepted: acceptedItems });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Food Orders:</Text>
      <FlatList
        data={foodData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Food Details</Text>
            {item.foodDetails.map((foodItem, foodIndex) => (
              <View key={foodIndex} style={styles.foodItem}>
                <Text style={styles.foodName}>{foodItem.foodName}</Text>
                <Text style={styles.foodPrice}>Price: ${foodItem.price}</Text>
                <Text style={styles.foodQuantity}>Quantity: {foodItem.quantity}</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>Payment Method</Text>
            <Text style={styles.sectionText}>{item.paymentMethod}</Text>

            <Text style={styles.sectionTitle}>Pick Up Time</Text>
            <Text style={styles.sectionText}>{item.pickUpTime}</Text>

            <Button
              title={selectedItems.includes(index) ? 'Deselect' : 'Select'}
              onPress={() => {
                if (selectedItems.includes(index)) {
                  setSelectedItems((prevSelected) => prevSelected.filter((itemIndex) => itemIndex !== index));
                } else {
                  setSelectedItems((prevSelected) => [...prevSelected, index]);
                }
              }}
            />
          </View>
        )}
      />
      <Button title="Accept Selected" onPress={handleAcceptItems} />
      <Button title="Not Accept Selected" onPress={handleRejectItems} />
      <Button title="View Accepted Orders" onPress={navigateToAcceptedOrders} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'maroon',
  },
  card: {
    backgroundColor: 'lightgray',
    padding: 16,
    margin: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'gray',
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'maroon',
    marginTop: 10,
  },
  sectionText: {
    fontSize: 16,
    color: 'maroon',
  },
  foodItem: {
    marginVertical: 10,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'maroon',
  },
  foodPrice: {
    fontSize: 14,
    color: 'maroon',
  },
  foodQuantity: {
    fontSize: 14,
    color: 'maroon',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default BusinessFoodOrderView;
