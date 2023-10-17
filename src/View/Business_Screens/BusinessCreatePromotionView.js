import React, { Component } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import BusinessPromotionController from '../../Controller/Business_Controller/BusinessPromotionController';

class DiscountView extends Component {
  constructor() {
    super();
    this.state = {
      price: 0,
      discountName: '',
      discountDescription: '',
      discountPercentage: '',
      discounts: [],
      startDate: '',
      endDate: '',
      daysDifference: null,
    };
  }

  handleAddDiscount = () => {
    const { price, discountPercentage, discountName, discountDescription, discounts, startDate, endDate } = this.state;

    if (
      discountPercentage !== '' &&
      !isNaN(discountPercentage) &&
      discountName !== '' &&
      discountDescription !== ''
    ) {
      const newDiscount = BusinessPromotionController.calculateDiscount(
        price,
        parseFloat(discountPercentage),
        discountName,
        discountDescription
      );

      discounts.push(newDiscount);
      this.setState({
        discounts,
        discountName: '',
        discountDescription: '',
        discountPercentage: '',
      });
    }

    if (startDate && endDate) {
      const daysDifference = DiscountController.calculateDaysDifference(startDate, endDate);
      this.setState({ daysDifference });
    }
  }

  // handleCalculateDaysDifference = () => {
  //   const { startDate, endDate } = this.state;
  //   if (startDate && endDate) {
  //     const daysDifference = BusinessPromotionController.calculateDaysDifference(startDate, endDate);
  //     this.setState({ daysDifference });
  //   }
  // }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter Price"
            onChangeText={(text) => this.setState({ price: parseFloat(text) })}
          />
          <TextInput
            style={styles.input}
            placeholder="Discount Name"
            value={this.state.discountName}
            onChangeText={(text) => this.setState({ discountName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Discount Description"
            value={this.state.discountDescription}
            onChangeText={(text) => this.setState({ discountDescription: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Discount Percentage"
            value={this.state.discountPercentage}
            onChangeText={(text) => this.setState({ discountPercentage: text })}
          />
          <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD)"
          value={this.state.startDate}
          onChangeText={(text) => this.setState({ startDate: text })}
          />
          <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD)"
          value={this.state.endDate}
          onChangeText={(text) => this.setState({ endDate: text })}
          />

          <Button title="Add Discount" onPress={this.handleAddDiscount} />
        </View>
        <FlatList
          data={this.state.discounts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.discountItem}>
              <View style={styles.discountItemContent}>
                <Text style={styles.discountItemText}>Name: {item.name}</Text>
                <Text style={styles.discountItemText}>Description: {item.description}</Text>
              </View>
                <Text style={styles.discountItemPrice}>
                  {item.percentage}% Discount: {item.discountedPrice}
                </Text>
            </View>
          )}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  inputContainer: {
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    elevation: 3, // Adds a slight shadow (Android)
    shadowColor: 'black', // Adds a slight shadow (iOS)
    shadowOffset: { width: 0, height: 2 }, // Adds a slight shadow (iOS)
    shadowOpacity: 0.2, // Adds a slight shadow (iOS)
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  discountItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  discountItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },  
  discountItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DiscountView;
