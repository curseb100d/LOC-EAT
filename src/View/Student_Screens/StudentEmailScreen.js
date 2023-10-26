import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { db_auth } from '../../Components/config';
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updateEmail,
  sendEmailVerification,
} from 'firebase/auth';

export default function StudentEmailScreen() {
  const currentUser = db_auth.currentUser;
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const userEmail = currentUser ? currentUser.email : '';

  const handleChangeEmail = async () => {
    const updatedEmail = newEmail.trim();

    if (updatedEmail) {
      const currentPassword = password; // Password for reauthentication

      if (currentUser) {
        // Reauthenticate with the user's current password
        const credentials = EmailAuthProvider.credential(currentUser.email, currentPassword);

        try {
          await reauthenticateWithCredential(currentUser, credentials);

          // Update the user's email address
          await updateEmail(currentUser, updatedEmail);

          // Send a verification email to the new email address
          await sendEmailVerification(currentUser);

          setMessage('A verification email has been sent to your new email address. Please verify your email to complete the change.');

          // Update the state
          setNewEmail(updatedEmail);
        } catch (error) {
          setMessage('Error updating email: ' + error.message);
        }
      } else {
        setMessage('User not found. Please log in again.');
      }
    } else {
      setMessage('Please enter a valid email.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Change Email</Text>
      <Text style={styles.emailText}>Current Email: {userEmail}</Text>
      <TextInput
        style={styles.input}
        placeholder="New Email"
        value={newEmail}
        onChangeText={(text) => setNewEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Current Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <Button
        title="Save"
        color="#FFED00"
        textColor="black"
        onPress={handleChangeEmail}
      />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'maroon',
  },
  header: {
    fontSize: 24,
    color: 'white',
  },
  emailText: {
    fontSize: 16,
    color: 'white',
  },
  input: {
    height: 40,
    borderColor: 'maroon',
    borderWidth: 0,
    paddingLeft: 10,
    width: 250,
    marginTop: 20,
    backgroundColor: 'white',
  },
  message: {
    fontSize: 16,
    color: 'white',
    marginTop: 20,
  },
});
