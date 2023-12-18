import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { db_auth } from '../../Components/config';
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../Components/config';
import { getDownloadURL, uploadBytes, ref, listAll, deleteObject } from 'firebase/storage';

export default function BusinessEditScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();
  const [userUID, setUserUID] = useState(null);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUID(user.uid);
        setUserEmail(user.email);
      } else {
        setUserUID(null);
        setUserEmail(null);
      }
    });

    return unsubscribe;
  }, [auth]);


  useEffect(() => {
    // Fetch the email of the current user
    const currentUser = db_auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords don't match");
      return;
    }

    try {
      const user = db_auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      // Reauthenticate the user with their current password
      await reauthenticateWithCredential(user, credential);

      // Change the password
      await updatePassword(user, newPassword);

      setMessage('Password changed successfully');

      // Navigate back to StudentAccountView
      navigation.navigate('BusinessProfileView');
    } catch (error) {
      setMessage('Password Change Failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Change Password</Text>

      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Text style={styles.message}>{message}</Text>

      <TouchableOpacity style={styles.button} onPress={handleChangePassword}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'maroon',
  },
  backButton: {
    width: 60,
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    alignItems: 'center',
    fontsize: 30,
    borderRadius: 10,
    backgroundColor: '#FFE135',
  },
  backButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    width: 300,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    color: 'black',
  },
  message: {
    fontSize: 18,
    color: 'white',
    marginBottom: 20,
  },
  button: {
    width: 150,
    height: 40,
    borderRadius: 25,
    backgroundColor: '#FFE135',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: 'black',
  },
};
