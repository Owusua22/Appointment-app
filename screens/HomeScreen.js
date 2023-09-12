// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const HomeScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem('appointments');
      if (data !== null) {
        setAppointments(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error reading data:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text>{item.title}</Text>
      <Text>{moment(item.date).format('LLL')}</Text>
      <Button
        title="Edit"
        onPress={() => navigation.navigate('EditAppointment', { appointment: item })}
      />
      <Button
        title="Delete"
        onPress={() => handleDelete(item.id)}
      />
    </View>
  );

  const handleDelete = async (id) => {
    try {
      const updatedAppointments = appointments.filter((appointment) => appointment.id !== id);
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Appointments</Text>
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
      <Button
        title="Add Appointment"
        onPress={() => navigation.navigate('AddAppointment')}
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  appointmentItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    borderRadius: 8,
  },
});

export default HomeScreen;
