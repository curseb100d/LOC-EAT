import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';

export default function BusinessCreateView({ nvigation }) {
  const [foodItems, setFoodItems] = useState(BusinessCreateController.getAllFoodItems());
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  useEffect(() => {
    setFoodItems(BusinessCreateController.getAllFoodItems());
  }, []);

  const handleAddFood = () => {
    BusinessCreateController.addFoodItem(name, price, type);
    setFoodItems(BusinessCreateController.getAllFoodItems());
    setName('');
    setPrice('');
    setType('');
  };

  const handleEdit = (item) => {
    setEditItemId(item.id);
    setName(item.name);
    setPrice(item.price);
    setType(item.type);
    setEditMode(true);
  };

  const handleUpdate = () => {
    BusinessCreateController.updateFoodItem(editItemId, name, price, type);
    setFoodItems(BusinessCreateController.getAllFoodItems());
    setEditMode(false);
    setEditItemId(null);
    setName('');
    setPrice('');
    setType('');
  };

  const handleDelete = (id) => {
    BusinessCreateController.deleteFoodItem(id);
    setFoodItems(BusinessCreateController.getAllFoodItems());
  };
  
  const renderEditForm = () => {
    if (!editMode) return null;

    return (
      <View style={styles.editForm}>
        <Text style={styles.editFormTitle}>Edit Food Item</Text>
        <TextInput
          placeholder="Name"
          value={name}
          onChangeText={(text) => setName(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={(text) => setPrice(text)}
          style={styles.input}
          keyboardType="numeric"
        />
        <TextInput
          placeholder="Type"
          value={type}
          onChangeText={(text) => setType(text)}
          style={styles.input}
        />
        <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setEditMode(false)} style={styles.cancelButton}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Food Menu</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Type"
        value={type}
        onChangeText={(text) => setType(text)}
        style={styles.input}
      />
      <TouchableOpacity onPress={handleAddFood} style={styles.addButton}>
        <Text style={styles.buttonText}>Add Food</Text>
      </TouchableOpacity>
      {renderEditForm()}
      <FlatList
        data={foodItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

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