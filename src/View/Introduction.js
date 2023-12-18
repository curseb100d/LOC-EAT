import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, Animated } from 'react-native';

export default function Introduction({ navigation }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      // Automatically navigate to 'Login' after 3 seconds
      navigation.replace('Login');
    }, 3000);

    // Clear the timer if the component unmounts or navigation occurs
    return () => {
      clearTimeout(timer);
      fadeAnim.setValue(0);
    };
  }, [fadeAnim, navigation]);

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>Welcome to</Animated.Text>
      <Animated.Image
        source={require('./LOC-EAT.png')}
        style={[styles.logo, { opacity: fadeAnim }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'maroon',
  },
  logo: {
    width: 300, // Adjust the width as needed
    height: 60, // Adjust the height as needed
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
});
