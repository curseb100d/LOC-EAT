import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { FontAwesome } from 'react-native-vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

// Screens
import BusinessDashboardView from './View/Business_Screens/BusinessDashboardView';
import BusinessCreatePromotionMain from './View/Business_Screens/BusinessCreatePromotionMain';
import BusinessCreateMain from './View/Business_Screens/BusinessCreateMain';
import BusinessFoodOrderView from './View/Business_Screens/BusinessFoodOrderView';
import BusinessProfileView from './View/Business_Screens/BusinessProfileView';

// Screen names
const dashBoard = "Dashboard";
const busPromote = "Promotion";
const busCreate = "Create";
const foodOrder = "Orders";
const busOwnerAccount = "Account";

const Tab = createMaterialBottomTabNavigator();

function BusinessHome() {
  return (
    <Tab.Navigator
      initialRouteName={dashBoard}
      activeColor="maroon"
      inactiveColor="black"
      barStyle={{
        backgroundColor: '#FFD700',
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name={dashBoard} component={BusinessDashboardView} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="chart-line-variant" color={color} size={26} />) }} />
      <Tab.Screen name={busPromote} component={BusinessCreatePromotionMain} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="percent" color={color} size={26} />) }} />
      <Tab.Screen name={busCreate} component={BusinessCreateMain} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="plus" color={color} size={26} />) }} />
      <Tab.Screen name={foodOrder} component={BusinessFoodOrderView} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="format-list-bulleted" color={color} size={26} />) }} />
      <Tab.Screen name={busOwnerAccount} component={BusinessProfileView} options={{ tabBarIcon: ({ color }) => (<MaterialCommunityIcons name="account" color={color} size={26} />) }} />
    </Tab.Navigator>
  );
}

export default BusinessHome;
