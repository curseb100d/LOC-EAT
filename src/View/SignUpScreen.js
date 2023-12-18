import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Image } from 'react-native';
import { db_auth } from '../Components/config';
import { createUserWithEmailAndPassword } from 'firebase/auth';
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
      ...(userType === 'user' && {
        schoolId: userType === 'user' ? schoolId : '',
        department: userType === 'user' ? department : '',
        course: userType === 'user' ? course : '',
      }),

      // Omit business-related fields if userType is 'user'
      ...(userType === 'business' && {
        businessName: businessName,
        location: location,
        timeOpen: timeOpen,
        schedule: schedule,
      }),
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

  const toggleUserType = () => {
    // Toggle between 'user' and 'business' when the button is pressed
    setUserType(userType === 'user' ? 'business' : 'user');
  };

  return (
    <View style={styles.container}>
      {/* <Text style={{ marginBottom: 10, marginTop: 55 }}>
        <Text style={styles.yellowText}>LOC</Text>
        <Text style={styles.yellowText}> - </Text>
        <Text style={styles.whiteText}>EAT</Text>
      </Text> */}
        <Image
          source={require('./LOC-EAT.png')}
          style={styles.logo}
        />

      <View style={{
        flexDirection: 'row',     // Arrange the text and border in a row
        justifyContent: 'center',  // Center the text horizontally
        alignItems: 'center',      // Center the text vertically
        borderColor: 'white',     // Set your desired border color
        borderWidth: 1,           // You can adjust the border width
        marginBottom: 15,        // Add margin to the bottom of the view
        paddingVertical: 5,       // Add vertical padding to create space between the text and the border
        paddingHorizontal: 18,     // Add horizontal padding to make left and right borders larger
        borderRadius: 25,
      }}>
        <TouchableOpacity onPress={toggleUserType}>
          <Text style={{ fontSize: 25, marginTop: 2, fontWeight: 'bold', color: 'white', }}>
            {userType === 'user' ? 'User' : 'Business User'}
          </Text>
        </TouchableOpacity>
      </View>


      <ScrollView style={{
        flex: 1, // Take up remaining horizontal space
        borderWidth: 1,
        borderColor: 'maroon',
        borderRadius: 20,
        padding: 10,
        paddingRight: 15,
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

        {/* User-specific input fields */}
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

        {/* Business-specific input fields */}
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
          </>
        )}

        {/* Common input fields */}
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
    borderRadius: 18,
    borderColor: 'black',
    borderWidth: 1
  },
  picker: {
    width: 300,
    color: 'white',
    marginBottom: '35',
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
  button: {
    width: 180,
    height: 45,
    borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
    backgroundColor: '#FFE135', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  buttonText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 20,
  },
  redirect: {
    fontSize: 16,
    marginTop: 5,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 55,
  },
  logo: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 30,
    marginTop: 30,
    marginBottom: 30,
    width: 300,
    height: 30,
  },
});