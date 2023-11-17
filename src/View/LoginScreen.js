import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Touchable } from 'react-native';
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

      // Check if userType is set
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
      <Text style={{marginBottom:150}}>
        <Text style={styles.yellowText}>LOC</Text>
        <Text style={styles.yellowText}> - </Text>
        <Text style={styles.whiteText}>EAT</Text>
        </Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity onPress={navigateToForgotPassword}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'white', marginBottom:20}}>
          Forgot password?
        </Text>
      </TouchableOpacity>

      <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={LoginIn}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>

      <TouchableOpacity onPress={navigateToSignUp}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 100, color: 'white', }}>
        Sign up
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
    backgroundColor: '#800000',
  },
  input: {
    fontSize: 15,
    backgroundColor: 'white',
    padding: 10,
    width: 300,
    marginBottom: 15,
    borderRadius:18,
    borderColor:'black',
    borderWidth:1
  },
  button: {
    width: 150,
    height: 40,
    borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
    backgroundColor: '#FFE135', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:20,
    marginBottom:5,
  },
  buttonText: {
    fontWeight:'bold',
    color: 'black',
    fontSize: 20,
  },
  yellowText: {
    color: 'yellow',
    fontSize: 50, // Set your desired font size
    fontWeight: 'bold', // Make the text bold
    fontFamily: 'sans-serif', // Set a custom font family if desired
  },
  whiteText: {
    color: 'white',
    fontSize: 50, // Set your desired font size
    fontWeight: 'bold', // Make the text bold
    fontFamily: 'sans-serif', // Set a custom font family if desired
  },
});