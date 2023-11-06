import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { ref, set, get } from "firebase/database";
import { db } from '../../Components/config';
import { db_auth } from '../../Components/config';

export default function CalendarScreen() {
  const [selectedDay, setSelectedDay] = useState(null);
  const [status, setStatus] = useState({});
  const currentUser = db_auth.currentUser;

  useEffect(() => {
    const defaultStatus = {};
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Set the status for all days in the current month and future dates to "open"
    for (let year = currentYear; year <= currentYear + 1; year++) { // Set for the current year and next year
      const lastMonth = year === currentYear ? currentMonth : 1; // Only set for the current month in the current year
      const lastDay = year === currentYear ? lastDayOfMonth : 31;

      for (let month = lastMonth; month <= 12; month++) {
        for (let day = 1; day <= (year === currentYear && month === currentMonth ? lastDay : 31); day++) {
          const currentDateString = year + '-' + month.toString().padStart(2, '0') + '-' + day.toString().padStart(2, '0');
          defaultStatus[currentDateString] = 'open';
        }
      }
    }

    setStatus(defaultStatus);
  }, []);

  useEffect(() => {
    if (selectedDay) {
      const userStatusRef = ref(db, `Business user/${currentUser.uid}/${selectedDay}`);

      get(userStatusRef)
        .then((snapshot) => {
          const statusData = snapshot.val();

          if (statusData !== null) {
            setStatus({ ...status, [selectedDay]: statusData });
          }
        })
        .catch((error) => {
          console.error('Error retrieving status data:', error);
        });
    }
  }, [selectedDay]);

  const toggleStatus = (day) => {
    const newStatus = status[day] === 'open' ? 'close' : 'open';

    // Get a reference to the 'status' node in your database
    const statusRef = ref(db, `Business user/${currentUser.uid}/${day}`);

    // Set the new status in the database
    set(statusRef, newStatus)
      .then(() => {
        setStatus({ ...status, [day]: newStatus });
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  };

  const renderStatusButton = () => {
    if (selectedDay) {
      return (
        <View style={styles.statusButtonContainer}>
          <Text style={styles.statusText}>Status: {status[selectedDay]}</Text>
          <TouchableOpacity
            style={[styles.circularButton, { backgroundColor: status[selectedDay] === 'open' ? 'green' : 'red' }]}
            onPress={() => toggleStatus(selectedDay)}
          >
            <Text>Toggle Status</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => {
          console.log('selected day', day);
          setSelectedDay(day.dateString); // Save the selected day
        }}
        markedDates={{
          [selectedDay]: {
            selected: true,
          },
        }}
      />

      {renderStatusButton()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  statusButtonContainer: {
    alignItems: 'center',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
  },
  circularButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
