import React, { Component } from 'react';
import { View, Text, Button, FlatList } from 'react-native';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sales: 0,
      orders: 0,
      customers: 0,
      revenue: 0,
      popularOrders: [],
    };
  }

  calculateDashboardData = () => {
    // You would replace these with actual data retrieval from your backend.
    const dailyData = [
      {
        date: '2023-10-01',
        sales: 1500,
        orders: 30,
        customers: 25,
        revenue: 2000,
        popularOrders: ['Pizza', 'Burger', 'Salad'],
      },
      {
        date: '2023-10-02',
        sales: 1800,
        orders: 35,
        customers: 28,
        revenue: 2200,
        popularOrders: ['Burger', 'Pasta', 'Soda'],
      },
      // Add more daily data here...
    ];

    // Sum up data for the selected day (you can adjust this to your needs).
    const selectedDayData = dailyData[0];

    this.setState({
      sales: selectedDayData.sales,
      orders: selectedDayData.orders,
      customers: selectedDayData.customers,
      revenue: selectedDayData.revenue,
      popularOrders: selectedDayData.popularOrders,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Calculate Data" onPress={this.calculateDashboardData} />
        <Text style={styles.text}>Total Sales: {this.state.sales}</Text>
        <Text style={styles.text}>Total Orders: {this.state.orders}</Text>
        <Text style={styles.text}>Total Customers: {this.state.customers}</Text>
        <Text style={styles.text}>Total Revenue: {this.state.revenue}</Text>
        <Text style={styles.heading}>Popular Orders:</Text>
        <FlatList
          data={this.state.popularOrders}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <Text style={styles.text}>{item}</Text>}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    marginVertical: 5,
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
};

export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import {View, Text, Button, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
// import { storage } from '../../Components/config';
// import { getDownloadURL, uploadBytes, ref, deleteObject, listAll } from 'firebase/storage';

// const AddFoodImage = () => {
//   const [image, setImage] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const pickImage = async () => {
//     setIsLoading(true);
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.All,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       const uploadURL = await uploadImageAsync(result.assets[0].uri);
//       setImage(uploadURL);
//       setIsLoading(false);
//     } else {
//       setImage(null);
//       setIsLoading(false);
//     }
//   };

//   const uploadImageAsync = async (uri) => {
//     const blob = await new Promise((resolve, reject) => {
//       const xhr = new XMLHttpRequest();
//       xhr.onload = function () {
//         resolve(xhr.response);
//       };
//       xhr.onerror = function (e) {
//         console.log(e);
//         reject(new TypeError('Network request failed'));
//       };
//       xhr.responseType = 'blob';
//       xhr.open('GET', uri, true);
//       xhr.send(null);
//     });

//     try {
//       const storageRef = ref(storage, `Images/image-${Date.now()}`);
//       const result = await uploadBytes(storageRef, blob);

//       blob.close();
//       return await getDownloadURL(storageRef);
//     } catch (error) {
//       alert(`Error: ${error}`);
//     }
//   };

//   const deleteImage = async () => {
//     setIsLoading(true);
//     const deleteRef = ref(storage, image);
//     try {
//       deleteObject(deleteRef).then(() => {
//         setImage(null);
//         setIsLoading(false);
//       });
//     } catch (error) {
//       alert(`Error: ${error}`);
//     }
//   };

//   useEffect(() => {
//     // Function to fetch an image from Firebase Storage
//     const fetchImage = async () => {
//       const listRef = ref(storage, 'Images'); // Change 'Images' to your folder name
//       const images = await listAll(listRef);

//       if (images.items.length > 0) {
//         const imageRef = images.items[0]; // Fetch the first image, change as needed
//         const downloadURL = await getDownloadURL(imageRef);
//         setImage(downloadURL);
//       }
//     };

//     fetchImage();
//   }, []); // Fetch the image when the component mounts  

//   return (
//     <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//       <View style={{ paddingHorizontal: 6, width: '100%' }}>
//         {!image ? (
//           <TouchableOpacity
//             onPress={pickImage}
//             style={{
//               width: '100%',
//               height: 200,
//               borderWidth: 2,
//               borderStyle: 'dashed',
//               borderColor: 'gray',
//               borderRadius: 10,
//               backgroundColor: 'gray',
//               alignItems: 'center',
//               justifyContent: 'center',
//             }}
//           >
//             {isLoading ? (
//               <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//                 <ActivityIndicator color="#ff0000" animating size="large" />
//               </View>
//             ) : (
//               <Text style={{ fontSize: 20, color: 'gray', fontWeight: 'bold' }}>
//                 Pick an Image
//               </Text>
//             )}
//           </TouchableOpacity>
//         ) : (
//           <>
//             {image && (
//               <View
//                 style={{
//                   width: '100%',
//                   height: 200,
//                   borderRadius: 10,
//                   overflow: 'hidden',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}
//               >
//                 <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
//               </View>
//             )}

//             <Button title="Delete this image" onPress={deleteImage} />
//           </>
//         )}
//       </View>
//     </SafeAreaView>
//   );
// };

// export default AddFoodImage;