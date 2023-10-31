import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import BusinessDashboardView from './View/Business_Screens/BusinessDashboardView';
import BusinessCreatePromotionMain from './View/Business_Screens/BusinessCreatePromotionMain';
import BusinessCreateMain from './View/Business_Screens/BusinessCreateMain';
import BusinessFoodOrderView from './View/Business_Screens/BusinessFoodOrderView';
import BusinessProfileView from './View/Business_Screens/BusinessProfileView';

//Screen names
const dashBoard = "Dashboard";
const busPromote = "Promotion";
const busCreate = "Create";
const foodOrder = "Orders";
const busOwnerAccount = "Business Account";


const Tab = createBottomTabNavigator();

function BusinessHome() {
  return (
      <Tab.Navigator
        initialRouteName={busCreate}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === dashBoard) {
              iconName = focused ? 'search' : 'search-outline';

            } else if (rn === busPromote) {
              iconName = focused ? 'promotion' : 'promotion-outline';

            } else if (rn === busCreate) {
              iconName = focused ? 'create' : 'create-outline';

            } else if (rn === foodOrder) {
              iconName = focused ? 'cart' : 'cart-outline';

            } else if (rn === busOwnerAccount) {
              iconName = focused ? 'storeprofile' : 'store-outline';

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
        <Tab.Screen name={busPromote} component={BusinessCreatePromotionMain} />
        <Tab.Screen name={busCreate} component={BusinessCreateMain} />
        <Tab.Screen name={foodOrder} component={BusinessFoodOrderView} />
        <Tab.Screen name={busOwnerAccount} component={BusinessProfileView} />
          
      </Tab.Navigator>
  );
}

export default BusinessHome;