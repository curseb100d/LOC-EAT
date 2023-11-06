import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import StudentHomeView from './View/Student_Screens/StudentHomeView';
import StudentStoreView from './View/Student_Screens/StudentStoreView';
// import StudentSearchView from './View/Student_Screens/StudentSearchView';
import StudentCartView from './View/Student_Screens/StudentCartView';
import StudentAccountView from './View/Student_Screens/StudentAccountView';
// import StudentExample from './View/Student_Screens/StudentExample';

//Screen names
const homeName = "Home";
const storeName = "Store";
// const searchName = "Search";
const cartName = "Cart";
const accountName = "Account";
// const exampleName = "Example";

const Tab = createMaterialBottomTabNavigator();

function StudentHome() {
  return (
    <Tab.Navigator
      initialRouteName={homeName}
      activeColor="maroon"
      inactiveColor="black"
      barStyle={{
        backgroundColor: '#FFD700',
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name={homeName} component={StudentHomeView} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="home" color={color} size={26} />) }} />
      <Tab.Screen name={storeName} component={StudentStoreView} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="store" color={color} size={26} />) }} />
      {/* <Tab.Screen name={searchName} component={StudentSearchView} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="card-search-outline" color={color} size={26} />) }} /> */}
      <Tab.Screen name={cartName} component={StudentCartView} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="cart" color={color} size={26} />) }} />
      <Tab.Screen name={accountName} component={StudentAccountView} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="account" color={color} size={26} />) }} />
      {/* <Tab.Screen name={exampleName} component={StudentExample} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="account" color={color} size={26} />) }} /> */}
    </Tab.Navigator>
  );
}

export default StudentHome;