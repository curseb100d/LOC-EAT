import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Touchable } from 'react-native';
import { db_auth } from '../Components/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Picker } from '@react-native-picker/picker';
import { db } from '../Components/config';
import { ref, set } from 'firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignUpScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('user'); // 'user' or 'teacher'
  const [loading, setLoading] = useState(false);
  const [lastName, setLastName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [schoolId, setSchoolId] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [location, setLocation] = useState('');
  const [timeOpen, setTimeOpen] = useState('');
  const [schedule, setSchedule] = useState('');
  const [status, setStatus] = useState('');
  const [department, setDepartment] = useState(''); // New input field
  const [course, setCourse] = useState(''); // New input field
  const [confirmPassword, setConfirmPassword] = useState(''); // New input field
  const auth = db_auth;

  const handleAddAccount = () => {
    const accountData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      userType: userType,
      schoolId: userType === 'user' ? schoolId : '',
      department: userType === 'user' ? department : '',
      course: userType === 'user' ? course : '',
      businessName: userType === 'business' ? businessName : '',
      location: userType === 'business' ? location : '',
      timeOpen: userType === 'business' ? timeOpen : '',
      schedule: userType === 'business' ? schedule : '',
      status: userType === 'business' ? status : '',
    };

    const userPath = userType === 'user' ? 'Users' : 'Business user';
    const userRef = ref(db, `${userPath}/${email.replace('.', ',')}`);

    set(userRef, accountData)
      .then(() => {
        alert('Account created');
      })
      .catch((error) => {
        alert(error);
      });
  };

  const signUp = async () => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        alert('Passwords do not match. Please confirm your password.');
        setLoading(false);
        return;
      }
      
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Check your emails!');

      await AsyncStorage.setItem('userType', userType);
      navigation.navigate('Login');
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
      <Text style={{marginBottom:10, marginTop:55}}>
        <Text style={styles.yellowText}>LOC</Text>
        <Text style={styles.yellowText}> - </Text>
        <Text style={styles.whiteText}>EAT</Text>
        </Text>
      <ScrollView style={{
        flex: 1, // Take up remaining horizontal space
        borderWidth: 1,
        borderColor: 'maroon',
        borderRadius: 20,
        padding: 10,
        paddingRight:15,
        }}>
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
        {userType === 'user' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="School ID"
              value={schoolId}
              onChangeText={(text) => setSchoolId(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Department"
              value={department}
              onChangeText={(text) => setDepartment(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Course"
              value={course}
              onChangeText={(text) => setCourse(text)}
            />
          </>
        )}
        {userType === 'business' && (
          <>
            <TextInput
            style={styles.input}
            placeholder="Business Name"
            value={businessName}
            onChangeText={(text) => setBusinessName(text)}
            />
            <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={(text) => setLocation(text)}
            />
            <TextInput
            style={styles.input}
            placeholder="Time Open"
            value={timeOpen}
            onChangeText={(text) => setTimeOpen(text)}
            />
            <TextInput
            style={styles.input}
            placeholder="Schedule"
            value={schedule}
            onChangeText={(text) => setSchedule(text)}
            />
            <TextInput
            style={styles.input}
            placeholder="Status"
            value={status}
            onChangeText={(text) => setStatus(text)}
            />
          </>
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
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(text) => setConfirmPassword(text)}
        />

        <Text style={{ fontSize: 16, marginTop: 2, fontWeight: 'bold', color:"white" }}>Select User Type:</Text>
        <Picker
          selectedValue={userType}
          onValueChange={(itemValue) => setUserType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item style={{fontWeight:'bold', fontSize:16}} label="User" value="user" />
          <Picker.Item style={{fontWeight:'bold', fontSize:16}} label="Business User" value="business" />
        </Picker>
      </ScrollView>

      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={signUp}>
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      )}

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
    marginBottom: 18,
  },
  picker: {
    width: 300,
    color:'white',
    marginBottom:'35',
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
    marginTop:25,
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
    marginBottom:55,
  },
});