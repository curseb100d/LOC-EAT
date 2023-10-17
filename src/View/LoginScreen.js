import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db_auth } from '../Components/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ref, get } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '../Components/config';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState('');
  const auth = db_auth;

  const checkOwnerPathExistence = async (ownerPath) => {
    try {
      const ownerSnapshot = await get(ref(db, ownerPath));
      return ownerSnapshot.exists();
    } catch (error) {
      console.log('Error checking owner path:', error);
      return false;
    }
  };

  useEffect(() => {
    const fetchUserType = async () => {
      try {
        // Check if the user exists in the database
        const dbPath = 'Users/' + email.replace('.', ',');
        const ownerPath = 'Business user/' + email.replace('.', ',');
        console.log('Fetching data from path:', dbPath);

        const userSnapshot = await get(ref(db, dbPath));
        console.log('User snapshot:', userSnapshot.val());

        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          const userType = userData.userType;
          setUserType(userType);
        } else {
          // If the user doesn't exist in the "Users" path, check the "ownerPath"
          const ownerExists = await checkOwnerPathExistence(ownerPath);

          if (ownerExists) {
            setUserType('business');
          }
        }
      } catch (error) {
        console.log('Error fetching user type:', error);
        alert('Error fetching user type: ' + error.message);
      }
    };

    fetchUserType();
  }, [email]);

  const navigateBasedOnUserType = () => {
    if (userType === 'user') {
      navigation.navigate('StudentHome');
    } else if (userType === 'business') {
      navigation.navigate('BusinessHome');
    } else {
      console.log('Unknown user type:', userType);
      alert('Unknown user type');
    }
  };

  const LoginIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      // Check if userType is seta
      if (userType) {
        // Now, navigate based on userType
        navigateBasedOnUserType();
      } else {
        console.log('User type not found');
        alert('User type not found');
      }
    } catch (error) {
      console.log('Sign in failed:', error);
      alert('Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUpScreen');
  };

  const navigateToForgotPassword = () => {
    navigation.navigate('ForgotPasswordScreen');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Login" onPress={LoginIn} />
      )}

      <TouchableOpacity onPress={navigateToForgotPassword}>
        <Text style={styles.linkText}>
          Forgot Password?
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={navigateToSignUp}>
        <Text style={styles.linkText}>
          Don't have an account? Sign up
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
  input: {
    fontSize: 15,
    borderBottomWidth: 1,
    padding: 10,
    width: 300,
    marginBottom: 10,
  },
  linkText: {
    fontSize: 16,
    marginTop: 10,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
