import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

function BusinessAcceptedOrderScreen({ route }) {
  const { accepted } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Accepted Orders</Text>
      <FlatList
        data={accepted}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
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
          </View>
        )}
      />
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

export default BusinessAcceptedOrderScreen;
