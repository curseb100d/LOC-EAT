import React, { Component, useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, TouchableOpacity, Touchable } from 'react-native';
import BusinessPromotionController from '../../Controller/Business_Controller/BusinessPromotionController';
import { ref, set, update, remove } from "firebase/database";
import { db } from '../../Components/config';
import { firebase } from '../../Components/config';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

class BusinessCreatePromotionView extends Component {
  constructor() {
    super();
    this.state = {
      foodName: '',
      foodDiscountDescription: '',
      originalPrice: 0,
      discountPercentage: '',
      discounts: [],
      businessOwnerName: '',
      location: ''
    };
  }



  handleAddDiscount = () => {
    const { foodName, foodDiscountDescription, originalPrice, discountPercentage, discounts, businessOwnerName, location } = this.state;

    if (
      discountPercentage !== '' &&
      !isNaN(discountPercentage) &&
      foodName !== '' &&
      foodDiscountDescription !== '' &&
      businessOwnerName !== '' &&
      location !== ''
    ) {
      const newDiscount = BusinessPromotionController.calculateDiscount(
        foodName,
        foodDiscountDescription,
        originalPrice,
        parseFloat(discountPercentage),
        businessOwnerName,
        location
      );

      discounts.push(newDiscount);
      this.setState({
        foodName: '',
        foodDiscountDescription: '',
        discountPercentage: '',
        discounts,
        businessOwnerName: '',
        location: '',
      });
    }

    const databaseRef = ref(db, 'promotion');
    set(databaseRef, discounts)
      .then(() => {
        // Data saved successfully!
        alert('Food added');
      })
      .catch((error) => {
        // The write failed...
        alert(error);
      });

  }

  handleCalculateDaysDifference = () => {
    const { startDate, endDate } = this.state;
    if (startDate && endDate) {
      const daysDifference = BusinessPromotionController.calculateDaysDifference(startDate, endDate);
      this.setState({ daysDifference });
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Food Name"
            value={this.state.foodName}
            onChangeText={(text) => this.setState({ foodName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Food Discount Description"
            value={this.state.foodDiscountDescription}
            onChangeText={(text) => this.setState({ foodDiscountDescription: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Price"
            onChangeText={(text) => this.setState({ originalPrice: parseFloat(text) })}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Discount Percentage"
            value={this.state.discountPercentage}
            onChangeText={(text) => this.setState({ discountPercentage: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Owner Name"
            value={this.state.businessOwnerName}
            onChangeText={(text) => this.setState({ businessOwnerName: text })}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={this.state.location}
            onChangeText={(text) => this.setState({ location: text })}
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
          
          <View>
        <TouchableOpacity
          style={{ /* Add your custom styles here */ }}
          onPress={this.handleAddDiscount}
        >
          <Text style={styles.butt}>Add Discount</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ /* Add your custom styles here */ }}
          onPress={this.handleCalculateDaysDifference}
        >
          <Text style={styles.butt}>Total Days Left</Text>
        </TouchableOpacity>
      </View>

        </View>
        <FlatList
          data={this.state.discounts}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.discountItem}>
              <View style={styles.discountItemContent}>
                <Text style={styles.discountItemText}>Name: {item.foodName}</Text>
                <Text style={styles.discountItemText}>Description: {item.foodDiscountDescription}</Text>
              </View>
                <Text style={styles.discountItemPrice}>{item.percentage}% off</Text>
                <Text style={styles.discountItemPrice}>Discount: {item.discountedPrice}</Text>
                <Text style={styles.discountItemPrice}>Owner Name: {item.businessOwnerName}</Text>
                <Text style={styles.discountItemPrice}>Location: {item.location}</Text>
            </View>
          )}
        />
        {this.state.daysDifference !== null && (
          <View>
            <Text style={styles.discountItemPrice}>
              Days Left: {this.state.daysDifference}
            </Text>
          </View>
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor:'maroon',
  },
  inputContainer: {
    backgroundColor: '#FFD68A',
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
    backgroundColor:'white',
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
    color:'white',
  },
  butt: {
    width: 180,
    height: 50,
    borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
    backgroundColor: 'green', // Button background color
    marginTop:10,
    marginBottom:5,
    fontSize:20,
    fontWeight:'bold',
    textAlign:'center',
    textAlignVertical:'center',
    color:'white',
    marginLeft:80
  }
});

export default BusinessCreatePromotionView;
