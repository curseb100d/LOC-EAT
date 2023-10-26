import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StudentHome from './src/StudentHome';
import BusinessHome from './src/BusinessHome';
import LoginScreen from './src/View/LoginScreen';
import SignUpScreen from './src/View/SignUpScreen';
import BusinessCreateMain from './src/View/Business_Screens/BusinessCreateMain';

import StudentEditScreen from './src/View/Student_Screens/StudentEditScreen';
import ForgotPasswordScreen from './src/View/ForgotPasswordScreen';
import StudentCartView from './src/View/Student_Screens/StudentCartView';
import StudentEmailScreen from './src/View/Student_Screens/StudentEmailScreen'
import StudentSearchView from './src/View/Student_Screens/StudentSearchView';
import BusinessCreateAdd from './src/View/Business_Screens/BusinessCreateAdd';
import { CartProvider } from './src/Context/CartContext';

const Stack = createStackNavigator();

function App() {
  return (
    <CartProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
          <Stack.Screen name="BusinessCreateMain" component={BusinessCreateMain} />
          <Stack.Screen name="StudentEditScreen" component={StudentEditScreen} />
          <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
          <Stack.Screen name="StudentEmailScreen" component={StudentEmailScreen} />
          <Stack.Screen name="StudentHome" component={StudentHome} />
          <Stack.Screen name="BusinessHome" component={BusinessHome} />
          <Stack.Screen name="StudentSearchView" component={StudentSearchView} />
          <Stack.Screen name="Cart" component={StudentCartView} />
          <Stack.Screen name="BusinessCreateAdd" component={BusinessCreateAdd} />
        </Stack.Navigator>
      </NavigationContainer>
    </CartProvider>
  );
}

export default App;
