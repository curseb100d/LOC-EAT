import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, TouchableOpacity, Touchable } from 'react-native';
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

  const handleLoginRedirect = () => {
    // Navigate to the login page when the text is pressed
    navigation.navigate('Login'); // Replace 'Login' with the name of your login screen in your navigation stack.
  }

  return (
    <View style={styles.container}>
      <Text style={{marginBottom:30}}>
        <Text style={styles.yellowText}>LOC</Text>
        <Text style={styles.whiteText}> - </Text>
        <Text style={styles.whiteText}>EAT</Text>
        </Text>
      <TextInput
        style={styles.input}
        placeholder="First Name"
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Last Name"
        placeholderTextColor="rgba(0, 0, 0, 0.5)"
        value={lastName}
        onChangeText={(text) => setLastName(text)}
      />
      {userType === 'user' && ( // Render school id input for 'user'
        <TextInput
          style={styles.input}
          placeholder="School ID"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={schoolId}
          onChangeText={(text) => setSchoolId(text)}
        />
      )}
      {userType === 'business' && ( // Render business name input for 'business'
        <TextInput
          style={styles.input}
          placeholder="Business Name"
          placeholderTextColor="rgba(0, 0, 0, 0.5)"
          value={businessName}
          onChangeText={(text) => setBusinessName(text)}
        />
      )}
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

      <Text style={{ fontSize: 16, marginTop: 10, fontWeight: 'bold', color:"white"}}>Select User Type:</Text>
      <Picker
        selectedValue={userType}
        onValueChange={(itemValue) => setUserType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="User" value="user" />
        <Picker.Item label="Business User" value="business" />
      </Picker>
      
      <View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity
          style={styles.button}
          onPress={signUp}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      )}
    </View>

    <View>
      {/* Your other content here */}
      <TouchableOpacity onPress={handleLoginRedirect}>
        <Text style={styles.redirect}>
          Already have an account? Log in
        </Text>
      </TouchableOpacity>
    </View>
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
    backgroundColor: 'white',
    padding: 10,
    width: 300,
    marginTop:18,
  },
  picker: {
    width: 300,
    color:'white',
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
  button: {
    width: 180,
    height: 45,
    borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
    backgroundColor: '#FFE135', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:5,
  },
  buttonText: {
    fontWeight:'bold',
    color: 'black',
    fontSize: 20,
  },
  redirect: {
    fontSize: 16,
    marginTop: 5,
    color: 'white',
    fontWeight:'bold',
  }
});
