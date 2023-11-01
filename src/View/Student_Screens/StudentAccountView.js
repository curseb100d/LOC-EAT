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
      <Text style={styles.circularCardText}>CIRCULAR CARD</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : user ? (
        <View style={styles.userData}>
          <Card style={styles.card}>
            <Card.Content>
              <UserDetail value={`${user.firstName} ${user.lastName}`} fontSize={15} />
              <CircularCard />
              <UserDetail label="Student ID" value={user.schoolId} fontSize={11} />
              <UserDetail label="Department" value={user.department} fontSize={11} />
              <UserDetail label="Course" value={user.course} fontSize={11} />
            </Card.Content>
          </Card>
          <TouchableOpacity onPress={handleEditAccountClick}>
            <Text style={styles.linkText}>Edit Account</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogoutClick}>
            <Text style={styles.linkText}>Logout</Text>
          </TouchableOpacity>
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

const UserDetail = ({ value, fontSize }) => (
  <View style={styles.userDetailContainer}>
    <Text style={[styles.value, { fontSize }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'maroon',
  },
  userData: {},
  userDetailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 20,
    color: 'black',
    fontWeight: 'bold',
    height: 50,
    left: 20,
    width: 300,
    textAlign: 'center',
    marginBottom: -28, // Remove margin and set marginBottom to 0
    bottom: -169,
  },
  card: {
    backgroundColor: 'yellow',
    padding: 10,
    width: 400,
    height: 300,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 51,
    padding: 10,
    margin: 10,
    backgroundColor: '#FFD700',
    elevation: 10,
    marginTop: -350,
    marginLeft: -3,
  },
  circularCard: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 70,
    right: 140,
  },
  circularCardText: {
    color: 'white',
    fontSize: 16,
  },
  linkText: {
    color: 'white',
    fontSize: 22,
    marginTop: 15,
    marginLeft: 20,
    fontWeight: 'bold',
  },
});
