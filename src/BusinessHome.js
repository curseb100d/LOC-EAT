import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import BusinessDashboardView from './View/Business_Screens/BusinessDashboardView';
import BusinessCreateView from './View/Business_Screens/BusinessCreateView';
import BusinessFoodOrderView from './View/Business_Screens/BusinessFoodOrderView';
import BusinessProfileView from './View/Business_Screens/BusinessProfileView';



//Screen names
const dashBoard = "Dashboard";
const busCreate = "Create";
const foodOrder = "Orders";
const busOwnerAccount = "Account";

const Tab = createBottomTabNavigator();

function OwnerHome() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={busCreate}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === dashBoard) {
              iconName = focused ? 'search' : 'search-outline';

            } else if (rn === busCreate) {
              iconName = focused ? 'home' : 'home-outline';

            } else if (rn === foodOrder) {
              iconName = focused ? 'cart' : 'cart-outline';

            } else if (rn === busOwnerAccount) {
              iconName = focused ? 'store' : 'store-outline';

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

        <Tab.Screen name={dashBoard} component={BusinessDashboardView} />
        <Tab.Screen name={busCreate} component={BusinessCreateView} />
        <Tab.Screen name={foodOrder} component={BusinessFoodOrderView} />
        <Tab.Screen name={busOwnerAccount} component={BusinessProfileView} />
          
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default OwnerHome;