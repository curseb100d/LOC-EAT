import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { ref, onValue } from 'firebase/database';
import { db } from '../../Components/config';

function StudentOrderedList() {
//   const [ordersWithStatus, setOrdersWithStatus] = useState([]);

//   useEffect(() => {
//     // Fetch the orders with status from Firebase when the component loads
//     fetchOrdersFromFirebase();
//   }, []);

//   const fetchOrdersFromFirebase = async () => {
//     const ordersRef = ref(db, 'orderedFood'); // Update the path to match your data structure

//     onValue(ordersRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const data = snapshot.val();

//         // Convert the data object into an array with keys
//         const ordersArray = Object.keys(data).map((key) => ({
//           key,
//           ...data[key],
//         }));

//         setOrdersWithStatus(ordersArray);
//       }
//     });
//   };

//   const updateStatusOnFirebase = async (order) => {
//     try {
//       // Update the status for a specific order in Firebase
//       const orderRef = ref(db, `orderedFood/${order.key}`); // Update the path to match your data structure

//       // Assuming you have a 'status' field in your Firebase data
//       // Update it with the new status
//       await set(orderRef, {
//         ...order,
//         status: order.status,
//       });

//       // Update the local state with the updated status
//       const updatedOrders = ordersWithStatus.map((o) => (o.key === order.key ? order : o));
//       setOrdersWithStatus(updatedOrders);
//     } catch (error) {
//       console.error('Error updating status on Firebase:', error);
//     }
//   };

//   const handleStatusChange = (order, newStatus) => {
//     // Update the status locally first
//     const updatedOrder = { ...order, status: newStatus };
//     const updatedOrders = ordersWithStatus.map((o) => (o.key === order.key ? updatedOrder : o));
//     setOrdersWithStatus(updatedOrders);

//     // Update the status on Firebase
//     updateStatusOnFirebase(updatedOrder);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.sectionTitle}>Accepted Orders</Text>
//       <FlatList
//         data={ordersWithStatus}
//         keyExtractor={(item) => item.key}
//         renderItem={({ item }) => (
//           <View style={styles.card}>
//             <Text style={styles.acceptedOrderText}>Accepted Order Details:</Text>
//             <Text style={styles.acceptedOrderText}>{`Payment Method: ${item.paymentMethod}`}</Text>
//             <Text style={styles.acceptedOrderText}>{`Pick Up Time: ${item.pickUpTime}`}</Text>
//             {item.foodDetails ? (
//               item.foodDetails.map((foodItem, foodIndex) => (
//                 <View key={foodIndex} style={styles.foodItem}>
//                   <Text style={styles.foodName}>{foodItem.foodName}</Text>
//                   <Text style={styles.foodPrice}>Price: ${foodItem.price}</Text>
//                   <Text style={styles.foodQuantity}>Quantity: {foodItem.quantity}</Text>
//                 </View>
//               ))
//             ) : null}
//             <View style={styles.statusContainer}>
//               <Text style={styles.acceptedOrderText}>Status:</Text>
//               <TouchableOpacity
//                 style={[styles.statusButton, { backgroundColor: item.status === 'preparing' ? 'red' : 'lightgray' }]}
//                 onPress={() => handleStatusChange(item, 'preparing')}
//               >
//                 <Text style={styles.statusButtonText}>Preparing</Text>
//               </TouchableOpacity>
//               <TouchableOpacity
//                 style={[styles.statusButton, { backgroundColor: item.status === 'finished' ? 'green' : 'lightgray' }]}
//                 onPress={() => handleStatusChange(item, 'finished')}
//               >
//                 <Text style={styles.statusButtonText}>Finished</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         )}
//       />
//     </View>
//   );
}

const styles = StyleSheet.create({
  // Your styles remain the same
  // ...
});

export default StudentOrderedList;
