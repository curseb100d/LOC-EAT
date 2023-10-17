import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { db_auth } from '../Components/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import { db } from '../Components/config';
import { ref, set } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user'); // 'user' or 'teacher'
  const [loading, setLoading] = useState(false);
  const [lastName, setLastName] = useState(''); // REAL TIME
  const [firstName, setFirstName] = useState('');// REAL TIME
  const [schoolId, setSchoolId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const auth = db_auth;

  const handleAddAccount = () => {
    const accountData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      userType: userType,
      schoolId: userType === 'user' ? schoolId : '',
      businessName: userType === 'business' ? businessName : '',
    };

    // Create the account in the database under 'users' or 'teachers'.
    const userPath = userType === 'user' ? 'Users' : 'Business user';
    const userRef = ref(db, `${userPath}/${email.replace('.', ',')}`);
    

    set(userRef, accountData)
      .then(() => {
        // Data saved successfully!
        alert('Account created');
     
      })
      .catch((error) => {
        // The write failed...
        alert(error);
      });
  };

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Check your emails!');

      // Save userType to AsyncStorage
      await AsyncStorage.setItem('userType', userType);
      navigation.navigate('Login'); // Replace with the actual name of your login screen
      // Create the account in the Firebase Realtime Database
      handleAddAccount();
    } catch (error) {
      console.log(error);
      alert('Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      {userType === 'user' && ( // Render school id input for 'user'
        <TextInput
          style={styles.input}
          placeholder="School ID"
          value={schoolId}
          onChangeText={(text) => setSchoolId(text)}
        />
      )}
      {userType === 'business' && ( // Render business name input for 'business'
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          value={businessName}
          onChangeText={(text) => setBusinessName(text)}
        />
      )}
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

      <Text style={{ fontSize: 16, marginBottom: 5 }}>Select User Type:</Text>
      <Picker
        selectedValue={userType}
        onValueChange={(itemValue) => setUserType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Business User" value="business" />
      </Picker>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Create Account" onPress={signUp} />
      )}

      <Text style={{ fontSize: 16, marginTop: 10 }}>
        Already have an account? Log in
      </Text>
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
  picker: {
    width: 300,
  },
});
