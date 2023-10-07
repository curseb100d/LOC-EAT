import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import BusinessCreateController from '../../Controller/Business_Controller/BusinessCreateController';
import { ref, set, update, onValue, remove } from "firebase/database";
import { db } from '../../Components/config';
import { TextInput } from 'react-native-gesture-handler';


export default function StudentSearchView({ navigation }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState('');

  const readFoodmenu = () => {

    const starCountRef = ref(db, 'foodmenu/' + name);
    onValue(starCountRef, (snapshot) => {
      const data = snapshot.val();

      setName(data.name);
      setPrice(data.price);
      setType(data.type);

    });
  }

  return (
    <View>
      <Text>Gana na please...</Text>
      <TextInput value={name} onChangeText={(name) => { setName(name) }} placeholder='Name'></TextInput>
      <button onClick={readFoodmenu}> Gana na please... </button>
    </View>
  );
};