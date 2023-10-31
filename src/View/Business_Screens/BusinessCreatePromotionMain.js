import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView, TouchableOpacity, Touchable } from 'react-native';
import BusinessPromotionController from '../../Controller/Business_Controller/BusinessPromotionController';
import { ref, set, update, remove } from "firebase/database";
import { db } from '../../Components/config';
import { firebase } from '../../Components/config';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useNavigation } from '@react-navigation/native';

export default function BusinessCreatePromotionMain() {
  const navigation = useNavigation();

  const handleEditPromotionClick = () => {
    navigation.navigate('BusinessCreatePromotionAdd');
  }

  return (
    <TouchableOpacity onPress={handleEditPromotionClick}>
        <Text>Add Promotion</Text>
      </TouchableOpacity>
  )
}