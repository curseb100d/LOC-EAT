import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, Image, Alert, ScrollView } from 'react-native';
import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';
import { ref, set, update, remove } from "firebase/database";
import { db } from '../../Components/config';
import { firebase } from '../../Components/config';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';
import BusinessCreateAdd from './BusinessCreateAdd';

export default function BusinessCreateMain() {
  const [foodItems, setFoodItems] = useState(BusinessCreateController.getAllFoodItems());
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.name}</Text>
      <Text style={styles.itemDetail}>Price: {item.price}</Text>
      <Text style={styles.itemDetail}>Type: {item.type}</Text>
      <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View>

      <TouchableOpacity onPress={handleEditFoodClick}>
            <Text>Add Food</Text>
      </TouchableOpacity>
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  )

  function handleEditFoodClick() {
    navigation.navigate('BusinessCreateAdd');
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  addButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  pickButton:{
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButton:{
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  imageContainer:{
    marginTop: 30,
    marginBottom: 50,
    alignItems: 'center'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    borderRadius: 5,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  itemDetail: {
    fontSize: 16,
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  editForm: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
    marginBottom: 16,
  },
  editFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  updateButton: {
    backgroundColor: 'green',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
  cancelButton: {
    backgroundColor: 'red',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 8,
  },
});