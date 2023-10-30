import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import StudentHomeView from './View/Student_Screens/StudentHomeView';
import StudentSearchView from './View/Student_Screens/StudentSearchView';
import StudentCartView from './View/Student_Screens/StudentCartView';
import StudentAccountView from './View/Student_Screens/StudentAccountView';

//Screen names
const homeName = "Home";
const searchName = "Search";
const cartName = "Cart";
const accountName = "Account";

const Tab = createBottomTabNavigator();

function StudentHome() {
  return (
      <Tab.Navigator
        initialRouteName={searchName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === searchName) {
              iconName = focused ? 'search' : 'search-outline';

            } else if (rn === cartName) {
              iconName = focused ? 'cart' : 'cart-outline';

            } else if (rn === accountName) {
              iconName = focused ? 'account' : 'account-outline';

            } 

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
        screenOption={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'grey',
          labelStyle: { paddingBottom: 10, fontSize: 10 },
          style: { padding: 10, height: 70}
        }}>

        <Tab.Screen name={homeName} component={StudentHomeView} />
        <Tab.Screen name={searchName} component={StudentSearchView} />
        <Tab.Screen name={cartName} component={StudentCartView} />
        <Tab.Screen name={accountName} component={StudentAccountView} />
        
      </Tab.Navigator>
  );
}

export default StudentHome;