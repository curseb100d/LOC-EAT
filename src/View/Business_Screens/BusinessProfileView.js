import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, } from 'react-native';
import { db_auth } from '../../Components/config';
import { ref, get, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../../Components/config';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function BusinessProfileView() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [currentDayStatus, setCurrentDayStatus] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = db_auth.currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }

      console.log("Current User Email:", currentUser.email);

      const usersRef = ref(db, 'Business user');
      const emailQuery = query(
        usersRef,
        orderByChild('email'),
        equalTo(currentUser.email.toLowerCase()) // Convert email to lowercase
      );

      try {
        const snapshot = await get(emailQuery);
        console.log("Query Result:", snapshot.val());
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

    fetchUserData();
  }, []);

  const CircularCard = () => (
    <View style={styles.circularCard}>
    </View>
  );

  const UserDetail = ({ value }) => (
    <View style={styles.userDetailContainer}>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  useEffect(() => {
    const currentUser = db_auth.currentUser;
    if (!currentUser) {
      return;
    }

    const currentDate = new Date(); // Get the current date
    const currentDateString = currentDate.toISOString().split('T')[0]; // Format the current date as 'YYYY-MM-DD'
    const currentDayStatusRef = ref(db, `Business user/${currentUser.uid}/${currentDateString}`);

    onValue(currentDayStatusRef, (snapshot) => {
      const statusData = snapshot.val();

      if (statusData !== null) {
        setCurrentDayStatus(statusData);
      }
    });
  }, [currentDayStatus]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <View style={styles.userData}>
          <View style={styles.card}>
            <UserDetail
              value={`${user.firstName} ${user.lastName}`}
            />
            <CircularCard />
            <UserDetail
              value={user.businessName}
            />
            <UserDetail
              value={user.location}
            />
            <UserDetail
              value={user.schedule}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity onPress={handleEditAccountClick}>
                <Text style={styles.linkText}>Edit Account</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonWrapper}>
              <TouchableOpacity onPress={handleLogoutClick}>
                <Text style={styles.linkText}>Logout</Text>
              </TouchableOpacity>
              <Text style={styles.userDetail}>
                Status for Today: {currentDayStatus || 'N/A'}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <Text>No user data available</Text>
      )}
    </View>
  );

  function handleEditAccountClick() {
    navigation.navigate('BusinessEditScreen');
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    jjustifyContent: 'flex-start',
    backgroundColor: 'maroon',
  },
  userData: {
    marginTop: 50,
  },
  userDetailContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 180,
    marginTop: 5,
  },
  value: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  card: {
    padding: 15,
    width: '100%',
    height: '68%', // Adjust the height as needed
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#FFD700',
    elevation: 10,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    top: -52,
  },
  circularCard: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 75,
    borderColor: 'white',
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    position: 'absolute',
    top: '32%', // Center vertically
    left: '55%', // Center horizontally
    marginLeft: -75, // Half of width
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
    bottom: 50,
  },
  userDetail: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: "center",
    textAlign: 'center',
    top: 120,
  },
});
