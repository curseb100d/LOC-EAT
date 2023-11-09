import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { db_auth } from '../../Components/config';
import { ref, get, query, orderByChild, equalTo } from 'firebase/database';
import { db } from '../../Components/config';
import { Card } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


export default function StudentAccountView() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

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

  function handleEditAccountClick() {
    navigation.navigate('StudentEditScreen');
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
    justifyContent: 'flex-start',
    backgroundColor: 'maroon',
  },
  userData: {
    marginTop:50,
  },
  userDetailContainer: {
    alignItems:'center',
    justifyContent:'center',
    top:165,
    marginTop:5,
  },
  labelText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  value: {
    fontWeight: 'bold',
    fontSize:18,
  },
  card: {
    padding: 15,
    width: '100%',
    height: '70%', // Adjust the height as needed
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#FFD700',
    elevation: 10,
    borderBottomLeftRadius:50,
    borderBottomRightRadius:50,
    top:-52,
  },
  circularCard: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    borderRadius: 75,
    borderColor:'white',
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
    fontWeight:'black',
  },
  linkText: {
    color: 'white',
    fontSize: 22,
    marginTop: 15,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  buttonWrapper: {
    bottom:25,
  }
});
