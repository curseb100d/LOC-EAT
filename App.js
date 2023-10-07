import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StudentHome from './src/StudentHome';
import BusinessHome from './src/BusinessHome';
import LoginScreen from './src/View/LoginScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="StudentHome" component={StudentHome} />
        <Stack.Screen name="BusinessHome" component={BusinessHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;