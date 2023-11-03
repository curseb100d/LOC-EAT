import { Picker } from '@react-native-picker/picker';
import React, { Component } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function BusinessDashboardView() {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity onPress={() => navigation.navigate('BusinessCalendarScreen')}>
        <FontAwesome name="calendar" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
}