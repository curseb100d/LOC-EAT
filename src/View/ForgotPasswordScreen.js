import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { db_auth } from '../Components/config';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = db_auth;

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent. Check your email for further instructions.');

      // Navigate to the LoginScreen or any other appropriate screen
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Password reset request failed:', error);
      alert('Password reset request failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPasswordButton = (
    <TouchableOpacity
      style={styles.button}
      onPress={handleForgotPassword}
    >
      <Text style={styles.buttonText}>Reset Password</Text>
    </TouchableOpacity>
  );

  const backToLoginButton = (
    <TouchableOpacity
      style={styles.buttonR}
      onPress={() => navigation.navigate('Login')}
    >
      <Text style={styles.buttonText}>Back to Login</Text>
    </TouchableOpacity>
  );

  const handleLoginRedirect = () => {
    // Navigate to the login page when the text is pressed
    navigation.navigate('Login'); // Replace 'Login' with the name of your login screen in your navigation stack.
  }

  return (
    <View style={styles.container}>
      <Text style={{ marginTop: -50, marginBottom: 10 }}>
        <Text style={styles.yellowText}>LOC</Text>
        <Text style={styles.whiteText}> - </Text>
        <Text style={styles.whiteText}>EAT</Text>
      </Text>
      <Text style={styles.title}>Password Reset. {'\n\n'} If you wish to reset your password, please enter your email account.</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : resetPasswordButton}

      <TouchableOpacity onPress={handleLoginRedirect}>
        <Text style={styles.redirect}>
          Back to Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'maroon',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    justifyContent: 'center',
    textAlign: 'center',
    marginLeft: 15,
    marginRight: 15,
    marginBottom: 100,
    marginTop: 15
  },
  input: {
    fontSize: 15,
    padding: 10,
    width: 300,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  button: {
    width: 180,
    height: 50,
    borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
    backgroundColor: '#FFE135', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
  },
  buttonR: {
    width: 180,
    height: 50,
    borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
    backgroundColor: '#FFE135', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 150,
  },
  yellowText: {
    color: 'yellow',
    fontSize: 50, // Set your desired font size
    fontWeight: 'bold', // Make the text bold
    fontFamily: 'YourFontFamily', // Set a custom font family if desired
  },
  whiteText: {
    color: 'white',
    fontSize: 50, // Set your desired font size
    fontWeight: 'bold', // Make the text bold
    fontFamily: 'YourFontFamily', // Set a custom font family if desired
  },
  redirect: {
    fontSize: 16,
    marginTop: 5,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 55,
  },
});
