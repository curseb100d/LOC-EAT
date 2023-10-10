import * as React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet } from 'react-native';



export default function LoginScreen({ navigation }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
  const homeUsername = 'user';
  const homeBUsername = 'owner';
  const passwordSlave = 'user'; // Password for username 'user'
  const passwordKing = 'owner';   // Password for username 'owner'

  if (username === homeUsername && password === passwordSlave) {
    // Navigate to HomeScreen if the entered username and password match
    navigation.navigate('StudentHome');
  } else if (username === homeBUsername && password === passwordKing) {
    // Navigate to HomeB if the entered username and password match
    navigation.navigate('BusinessHome');
  } else {
    // Username or password not recognized, show an error message or handle it as needed
    alert('Invalid username or password. Please try again.');
  }
};

  return (
    <View style={styles.container}>
      <Text style={{ fontSize:50, marginBottom:120 }}>
        <Text style={{ fontFamily: 'sans-serif', color: '#F7AD19', fontWeight:'bold' }}>LOC -</Text>
        <Text style={{ fontFamily: 'sans-serif', color: '#f2f2f2', fontWeight:'bold' }}> EAT</Text>
      </Text>

      
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        style={[styles.input, styles.inputWithBorder, {marginBottom:10}]}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
        style={[styles.input, styles.inputWithBorder]}
      />
      <Text style={[styles.forgotPassword, {paddingTop:5, fontWeight:'bold'}]}>Forget Password?</Text>
      <TouchableOpacity
        onPress={handleLogin}
        style={[styles.loginButton, styles.centeredText]}
      >
        <Text style={[styles.loginButtonText, {fontWeight:'bold'}]}>Login</Text>
      </TouchableOpacity>
      <Text style={[styles.signupText, {marginBottom:200}]}>Don't have an account? Sign up</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'maroon', // Change background color to maroon
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    fontSize: 15,
    borderBottomWidth: 1,
    padding: 10,
    width: 300,
    height: 43,
    marginBottom: 10,
    color: 'black', // Text color for input
    backgroundColor: 'white', // Change background color to white
  },
  inputWithBorder: {
    borderColor: 'grey', // Border color
    borderWidth: 1, // Border width
    borderRadius: 5, // Add border-radius for rounded corners
  },
  loginButton: {
    backgroundColor: 'yellow',
    padding: 7,
    width: 300,
    alignItems: 'center',
    borderRadius: 100,
    marginTop: 20,
  },
  loginButtonText: {
    fontSize: 20,
    fontFamily: 'Poppins',
    color: 'black',
    fontWeight: 'bold',
  },
  centeredText: {
    alignItems: 'center',
  },
  signupText: {
    fontSize: 16,
    marginTop: 10,
    color: 'white',
    fontWeight: 'bold',
  },
  forgotPassword: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
  },
});
