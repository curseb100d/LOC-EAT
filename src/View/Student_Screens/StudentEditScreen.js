import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { db_auth } from '../../Components/config';
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function StudentEditScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

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
      navigation.navigate('StudentAccountView');
    } catch (error) {
      setMessage('Password Change Failed');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardContainer}>
        {/* Circular card */}
        <View style={styles.circularCard}>
          {/* Add your circular card content here */}
        </View>

        {/* Edit Account text */}
        <Text style={styles.editProfileText}>Edit Account</Text>

        {/* Button 1 (Custom Style) */}
        <View style={styles.button1Container}>
          <Button
            title="Change"
            color="grey" // Customize the color
            textColor="white" // Customize the text color
            onPress={() => {
              // Add functionality for Button 1 here
            }}
          />
        </View>
      </View>

      <TextInput
        style={{ ...styles.input, backgroundColor: 'white', marginTop: 10 }}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={{ ...styles.input, backgroundColor: 'white', marginTop: 10 }}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={{ ...styles.input, backgroundColor: 'white', marginTop: 10 }}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Text style={{ ...styles.message, color: 'white', marginTop: 10 }}>{message}</Text>

      <View style={styles.button2Container}>
        <Button
          title="Save"
          color="#FFED00"
          textColor="black"
          onPress={handleChangePassword}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: 'maroon',
  },
  cardContainer: {
    backgroundColor: 'yellow',
    padding: 10,
    width: 400,
    height: 250,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 51,
    padding: 10,
    margin: 10,
    backgroundColor: '#FFD700',
    elevation: 10,
    marginTop: -100,
    marginLeft: -22,
    flexDirection: 'row', // Arrange elements in a row
    alignItems: 'center', // Center elements vertically
  },
  circularCard: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'white', // Customize the color of the circular card
    margin: 10,
    bottom: -50,
    left: 20,
  },
  editProfileText: {
    fontSize: 18,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
    left: 20,
    bottom: -40,
    fontSize: 22,
  },
  button1Container: {
    height: 50,
    width: 100,
    marginTop: 190,
    marginLeft: -90,
  },
  input: {
    height: 40,
    borderColor: 'maroon',
    borderWidth: 0,
    paddingLeft: 10,
    width: 250,
    marginBottom: 5,
    bottom: -50,
    left: 50,
  },
  message: {
    fontSize: 16,
    marginTop: 200,
    bottom: -120,
    textAlign: 'center',
  },
  button2Container: {
    height: 100,
    marginTop: 40,
    width: 200,
    borderRadius: 30,
    left: 75,
  },
});
