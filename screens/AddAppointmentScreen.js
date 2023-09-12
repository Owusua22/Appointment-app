// src/screens/AddAppointmentScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';

const AddAppointmentScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

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

    const newAppointment = {
      id: Date.now(),
      title,
      date,
    };

    try {
      const existingAppointments = await AsyncStorage.getItem('appointments');
      const appointments = existingAppointments
        ? JSON.parse(existingAppointments)
        : [];

      appointments.push(newAppointment);

      await AsyncStorage.setItem('appointments', JSON.stringify(appointments));

      navigation.navigate('Home');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Appointment</Text>
      <TextInput
        placeholder="Appointment Title"
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
      <Button title="Save" onPress={handleSave} />
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

export default AddAppointmentScreen;
