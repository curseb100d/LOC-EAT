// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { ref, set } from "firebase/database";
// import { db } from '../../Components/config';

// export default function BusinessDashboardView({ navigation }) {
//     const [status, setStatus] = useState('open');

//     const toggleStatus = () => {
//       const newStatus = status === 'open' ? 'close' : 'open';

//       const statusRef = ref(db, 'status');

//       set(statusRef, newStatus)
//         .then(() => {
//           setStatus(newStatus);
//         })
//         .catch((error) => {
//           console.error('Error updating status:', error);
//         });
//     };

//     return (
//       <View style={styles.container}>
//         <View style={styles.statusContainer}>
//           <Text style={styles.statusText}>Status: {status}</Text>
//         </View>
//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={[styles.circularButton, { backgroundColor: status === 'open' ? 'green' : 'red' }]}
//             onPress={toggleStatus}
//           />
//         </View>
//       </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       flexDirection: 'row',
//       justifyContent: 'flex-end', // Adjusts the content to the right
//       alignItems: 'center',
//       padding: 20,
//     },
//     statusContainer: {
//       flex: 1,
//     },
//     buttonContainer: {
//       flex: 0,
//     },
//     statusText: {
//       fontSize: 18,
//     },
//     circularButton: {
//       width: 100,
//       height: 100,
//       borderRadius: 50,
//     },
//   });

import React, { useState, useEffect } from 'react';
import {View, Text, Button, TouchableOpacity, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../Components/config';
import { getDownloadURL, uploadBytes, ref, deleteObject, listAll } from 'firebase/storage';

const AddFoodImage = () => {
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uploadURL = await uploadImageAsync(result.assets[0].uri);
      setImage(uploadURL);
      setIsLoading(false);
    } else {
      setImage(null);
      setIsLoading(false);
    }
  };

  const uploadImageAsync = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    try {
      const storageRef = ref(storage, `Images/image-${Date.now()}`);
      const result = await uploadBytes(storageRef, blob);

      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const deleteImage = async () => {
    setIsLoading(true);
    const deleteRef = ref(storage, image);
    try {
      deleteObject(deleteRef).then(() => {
        setImage(null);
        setIsLoading(false);
      });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  useEffect(() => {
    // Function to fetch an image from Firebase Storage
    const fetchImage = async () => {
      const listRef = ref(storage, 'Images'); // Change 'Images' to your folder name
      const images = await listAll(listRef);

      if (images.items.length > 0) {
        const imageRef = images.items[0]; // Fetch the first image, change as needed
        const downloadURL = await getDownloadURL(imageRef);
        setImage(downloadURL);
      }
    };

    fetchImage();
  }, []); // Fetch the image when the component mounts  

  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ paddingHorizontal: 6, width: '100%' }}>
        {!image ? (
          <TouchableOpacity
            onPress={pickImage}
            style={{
              width: '100%',
              height: 200,
              borderWidth: 2,
              borderStyle: 'dashed',
              borderColor: 'gray',
              borderRadius: 10,
              backgroundColor: 'gray',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isLoading ? (
              <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator color="#ff0000" animating size="large" />
              </View>
            ) : (
              <Text style={{ fontSize: 20, color: 'gray', fontWeight: 'bold' }}>
                Pick an Image
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <>
            {image && (
              <View
                style={{
                  width: '100%',
                  height: 200,
                  borderRadius: 10,
                  overflow: 'hidden',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Image source={{ uri: image }} style={{ width: '100%', height: '100%' }} />
              </View>
            )}

            <Button title="Delete this image" onPress={deleteImage} />
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default AddFoodImage;