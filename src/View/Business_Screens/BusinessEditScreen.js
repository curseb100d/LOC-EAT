import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { db_auth } from '../../Components/config';
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../Components/config';
import { getDownloadURL, uploadBytes, ref, listAll, deleteObject } from 'firebase/storage';

export default function BusinessEditScreen() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userUID, setUserUID] = useState(null);
  const [imageRefs, setImageRefs] = useState([]); // Added state to store image file names

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserUID(user.uid);
        setUserEmail(user.email);
      } else {
        setUserUID(null);
        setUserEmail(null);
      }
    });

    return unsubscribe;
  }, [auth]);

  const pickImage = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const uploadURL = await uploadImageAsync(result.assets[0].uri, userUID);
      setImages([...images, uploadURL]);
      setImageRefs(...imageRefs, `image-${Date.now()}`); // Store the image file name
      setCurrentImageIndex(images.length);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  };

  const uploadImageAsync = async (uri, userUID) => {
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
      const imageName = `image-${Date.now()}`;
      const storageRef = ref(storage, `Images/${userUID}/${imageName}`);
      await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error: ${error}`);
      return null;
    }
  };

  const deleteImage = async () => {
    setIsLoading(true);
    const imageName = imageRefs[currentImageIndex]; // Get the image file name
    const deleteRef = ref(storage, `Images/${userUID}/${imageName}`);

    try {
      deleteObject(deleteRef).then(() => {
        const updatedImages = [...images];
        updatedImages.splice(currentImageIndex, 1);
        setImages(updatedImages);

        const updatedImageRefs = [...imageRefs];
        updatedImageRefs.splice(currentImageIndex, 1);
        setImageRefs(updatedImageRefs);

        if (currentImageIndex >= updatedImages.length) {
          setCurrentImageIndex(updatedImages.length - 1);
        }
        setIsLoading(false);
      });
    } catch (error) {
      alert(`Error: ${error}`);
    }
  };

  const changeImage = () => {
    // When the "Change Image" button is pressed, allow the user to select a new image.
    pickImage();
  };

  useEffect(() => {
    const fetchImages = async () => {
      if (userUID) {
        const listRef = ref(storage, `Images/${userUID}`);
        const imageList = await listAll(listRef);
        const downloadURLs = await Promise.all(imageList.items.map((imageRef) => getDownloadURL(imageRef)));
        setImages(downloadURLs);

        const imageFileNames = imageList.items.map((imageRef) => imageRef.name);

        if (imageFileNames.length > 0) {
          // Set the initial value of currentImageIndex to the last index in the database
          setCurrentImageIndex(imageFileNames.length - 1);
        } else {
          // No images in the database, set currentImageIndex to null
          setCurrentImageIndex(null);
        }

        setImageRefs(imageFileNames);
      }
    };

    fetchImages();
  }, [userUID]);

  useEffect(() => {
    // Fetch the email of the current user
    const currentUser = db_auth.currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage("New passwords don't match");
      return;
    }

    try {
      const user = db_auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, currentPassword);

      // Reauthenticate the user with their current password
      await reauthenticateWithCredential(user, credential);

      // Change the password
      await updatePassword(user, newPassword);

      setMessage('Password changed successfully');

      // Navigate back to StudentAccountView
      navigation.navigate('BusinessProfileView');
    } catch (error) {
      setMessage('Password Change Failed');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <View style={styles.circularCard}>
          <Image source={{ uri: images[currentImageIndex] }} style={{ width: 120, height: 120, borderRadius: 60 }} />
          {/* Add your circular card content here */}
        </View>

        {/* Edit Account text */}
        <Text style={styles.editProfileText}>Edit Account</Text>

        {/* Button 1 (Custom Style) */}
        {images.length === 0 ? (
          <TouchableOpacity onPress={changeImage}>
            <View style={styles.customButton2}>
              <Text style={styles.customButtonText2}>Change</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <>
            {images[currentImageIndex] && (
              <TouchableOpacity onPress={changeImage}>
                <View style={styles.customButton2}>
                  <Text style={styles.customButtonText2}>Change</Text>
                </View>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <TextInput
        style={{ ...styles.input, backgroundColor: 'white', marginTop: 10 }}
        placeholder="Current Password"
        secureTextEntry
        value={currentPassword}
        onChangeText={setCurrentPassword}
      />
      <TextInput
        style={{ ...styles.input, backgroundColor: 'white', marginTop: 10 }}
        placeholder="New Password"
        secureTextEntry
        value={newPassword}
        onChangeText={setNewPassword}
      />
      <TextInput
        style={{ ...styles.input, backgroundColor: 'white', marginTop: 10 }}
        placeholder="Confirm New Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Text style={{ ...styles.message, color: 'white', marginTop: 10 }}>{message}</Text>

      <View>
        <TouchableOpacity onPress={handleChangePassword}>
          <View style={styles.customButton}>
              <Text style={styles.customButtonText}>Save</Text>
          </View>
       </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: 'maroon',
  },
  cardContainer: {
    padding: 10,
    width: 400,
    height: 280,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 51,
    padding: 10,
    margin: 10,
    backgroundColor: '#FFD700',
    elevation: 10,
    marginTop: -100,
    marginLeft: -22,
    flexDirection: 'row', // Arrange elements in a row
    alignItems: 'center', // Center elements vertically
  },
  circularCard: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'white', // Customize the color of the circular card
    margin: 10,
    bottom: -50,
    left: 20,
  },
  editProfileText: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
    left: 30,
    bottom: -30,
    fontSize: 22,
  },
  button1Container: {
    height: 100,
    width: 100,
    marginTop: 150,
    marginLeft: -90,
  },
  input: {
    height: 40,
    borderColor: 'maroon',
    borderWidth: 0,
    paddingLeft: 10,
    width: 250,
    marginBottom: 5,
    bottom: -50,
    left: 50,
    borderRadius:35,
  },
  message: {
    fontSize: 18,
    top:110,
    bottom: -120,
    textAlign: 'center',
    fontWeight:'bold',
  },
  customButton: {
    width: 150,
    height: 40,
    borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
    backgroundColor: '#FFE135', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 5,
    left:100,
  },
  customButtonText: {
    fontWeight:'bold',
    fontSize:18,
  },
  customButton2: {
    width: 150,
    height: 40,
    borderRadius: 25, // Set the borderRadius to half of the width/height to make it circular
    backgroundColor: 'maroon', // Button background color
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 150,
    marginBottom: 5,
    right:110,
  },
  customButtonText2: {
    color:'white',
    fontWeight:'bold',
    fontSize:18,
  }
});
