import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image, BackHandler } from 'react-native';
import { db_auth } from '../../Components/config';
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { getDownloadURL, uploadBytes, listAll, ref as ref1 } from 'firebase/storage';
import { db } from '../../Components/config';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../Components/config';
import axios from 'axios';

export default function StudentAccountView() {
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userUID, setUserUID] = useState(null);
  const [imageRefs, setImageRefs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const [ordersWithStatus, setOrdersWithStatus] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = db_auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }

      const usersRef = ref(db, 'Users');
      const emailQuery = query(usersRef, orderByChild('email'), equalTo(currentUser.email));

      try {
        const snapshot = await get(emailQuery);
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const userKey = Object.keys(userData)[0];
          const user = userData[userKey];
          setUser(user);
          console.log(`Connected to user with email: ${currentUser.email}`);
          console.log('User data:', user);
        } else {
          console.log('User not found in the database');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchStatusFromFirebase = async () => {
      try {
        const userEmail = db_auth.currentUser.email;
        // Fetch data from your Realtime Firebase database using axios
        axios.get('https://loc-eat-ddb73-default-rtdb.firebaseio.com/orderedFood.json')
          .then((response) => {
            if (response.status === 200) {
              const data = response.data;

              const ordersArrayMapped = Object.keys(data).map((id) => {
                if (userEmail === data[id].userEmail && data[id].hasNotification) {
                  tempFoodMenu = {
                    id,
                    ...data[id],
                  }

                  return tempFoodMenu;
                } else {
                  return undefined;
                }
              });
              const ordersArray = ordersArrayMapped.filter((item) => { return (item) ? true : false });
              setOrdersWithStatus(ordersArray);
            }
          })


      } catch (error) {
        console.error('Error fetching data from Firebase:', error);
      }
    };

    fetchStatusFromFirebase();
    fetchUserData();
    console.log('ows', ordersWithStatus.length)
  }, []);

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
      setImageRefs([...imageRefs, `image-${Date.now()}`]);
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
      const storageRef = ref1(storage, `Images/${userUID}/${imageName}`);
      await uploadBytes(storageRef, blob);
      blob.close();
      return await getDownloadURL(storageRef);
    } catch (error) {
      alert(`Error: ${error}`);
      return null;
    }
  };

  const changeImage = () => {
    // When the "Change Image" button is pressed, allow the user to select a new image.
    pickImage();
  };

  useEffect(() => {
    const fetchImages = async () => {
      if (userUID) {
        const listRef = ref1(storage, `Images/${userUID}`);
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

  const UserDetail = ({ value }) => (
    <View style={styles.userDetailContainer}>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  function handleEditAccountClick() {
    navigation.navigate('StudentEditScreen');
  }

  function handleNotification() {
    navigation.navigate('StudentNotificationView');
  }

  function handleLogoutClick() {
    db_auth
      .signOut()
      .then(() => {
        console.log('User signed out');
        navigation.navigate('Login');
      })
      .catch((error) => {
        console.error('Error signing out:', error);
      });
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <View style={styles.userData}>
          <View style={styles.card}>
            <View style={styles.circularCard}>
              <Image source={{ uri: images[currentImageIndex] }} style={{ width: 120, height: 120, borderRadius: 60 }} />
              {/* Add your circular card content here */}
            </View>

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
            <UserDetail
              value={`${user.firstName} ${user.lastName}`}
            />


            <UserDetail
              value={user.schoolId}
            />
            <UserDetail
              value={user.department}
            />
            <UserDetail
              value={user.course}
            />
          </View>


          <View style={styles.buttonsContainer}>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity onPress={handleNotification}>
                <Text style={styles.linkText}>Notifications ({ordersWithStatus.length})</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity onPress={handleEditAccountClick}>
                <Text style={styles.linkText}>Edit Account</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity onPress={handleLogoutClick}>
                <Text style={styles.linkText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <Text>No user data available</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: 'maroon',
  },
  userData: {
    marginTop: 50,
  },
  userDetailContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: -10,
    marginTop: 5,
  },
  labelText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  value: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    padding: 15,
    width: '100%',
    height: '70%', // Adjust the height as needed
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#FFD700',
    elevation: 10,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    top: -52,
  },
  circularCard: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 75,
    borderColor: 'white',
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    position: 'absolute',
    top: '32%', // Center vertically
    left: '30%', // Center horizontally
    marginLeft: 38, // Half of width
    marginTop: -75, // Half of height
  },
  circularCardText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'black',
  },
  linkText: {
    color: 'white',
    fontSize: 22,
    marginTop: 15,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    bottom: 25,
  },
  customButtonText: {
    fontWeight: 'bold',
    fontSize: 18,
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
    right: -110,
    top: -20,
  },
  customButtonText2: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  }
});
