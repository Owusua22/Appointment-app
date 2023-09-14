// src/screens/EditAppointmentScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

const EditAppointmentScreen = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const { appointment, onUpdate } = route.params;

  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title);
      setDate(appointment.date);
    }
  }, [appointment]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (selectedDate) => {
    hideDatePicker();
    setDate(selectedDate);
  };

  const handleSave = async () => {
    if (!title || !date) {
      // Handle validation here
      return;
    }

    const updatedAppointment = {
      id: appointment.id,
      title,
      date,
    };

    try {
      const existingAppointments = await AsyncStorage.getItem('appointments');
      const appointments = existingAppointments
        ? JSON.parse(existingAppointments)
        : [];

      const updatedAppointments = appointments.map((appt) =>
        appt.id === appointment.id ? updatedAppointment : appt
      );

      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));

      // Pass the updated data back to the HomeScreen
      onUpdate(updatedAppointment);

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Edit Task</Text>
      <TextInput
        placeholder="Task Title"
        onChangeText={(text) => setTitle(text)}
        value={title}
        style={styles.input}
      />
      
      <View style={styles.datePicker}>
        <Text>Date and Time: {date ? moment(date).format('LLL') : 'Not set'}</Text>
        <Button title="Pick Date and Time" onPress={showDatePicker} />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
        />
      </View>
      <Button title="Save" onPress={handleSave} color="#e35622" // Change the background color
          style={{
            marginBottom: 10, // Add margin bottom
            borderRadius: 30, // Add border radius
          }}
          titleStyle={{
            color: "white",
            fontWeight: "bold",
          }}  />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
   backgroundColor:"#a573f0"
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color:"white"
  },
  input: {
    marginBottom: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  datePicker: {
    marginBottom: 16,
  },
});

export default EditAppointmentScreen;
