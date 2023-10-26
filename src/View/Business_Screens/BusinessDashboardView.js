import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ref, set } from "firebase/database";
import { db } from '../../Components/config';

export default function BusinessDashboardView({ navigation }) {
    const [status, setStatus] = useState('open');

    const toggleStatus = () => {
      const newStatus = status === 'open' ? 'close' : 'open';
  
      const statusRef = ref(db, 'status');
  
      set(statusRef, newStatus)
        .then(() => {
          setStatus(newStatus);
        })
        .catch((error) => {
          console.error('Error updating status:', error);
        });
    };
  
    return (
      <View style={styles.container}>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Status: {status}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.circularButton, { backgroundColor: status === 'open' ? 'green' : 'red' }]}
            onPress={toggleStatus}
          />
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'flex-end', // Adjusts the content to the right
      alignItems: 'center',
      padding: 20,
    },
    statusContainer: {
      flex: 1,
    },
    buttonContainer: {
      flex: 0,
    },
    statusText: {
      fontSize: 18,
    },
    circularButton: {
      width: 100,
      height: 100,
      borderRadius: 50,
    },
  });