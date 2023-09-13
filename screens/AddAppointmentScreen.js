import React, { useState, useEffect } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const AddAppointmentScreen = ({ navigation, route }) => {
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

  const handleAddAppointment = async () => {
    try {
      if (!title || !date) {
        // Add validation to check if title and date are provided
        alert('Complete Details to contineue!!!.');
        return;
      }

      // Create a new appointment object
      const newAppointment = {
        id: Math.random().toString(),
        title: title,
        date: date.toISOString(),
      };

      // Fetch existing appointments from AsyncStorage
      const existingAppointments = await AsyncStorage.getItem('appointments');
      const parsedAppointments = JSON.parse(existingAppointments) || [];

      // Add the new appointment to the list
      const updatedAppointments = [...parsedAppointments, newAppointment];

      // Save the updated appointments to AsyncStorage
      await AsyncStorage.setItem('appointments', JSON.stringify(updatedAppointments));

      // Call the callback function to notify HomeScreen
      route.params.onAppointmentAdded();

      // Navigate back to HomeScreen
      navigation.goBack();
    } catch (error) {
      console.error('Error adding appointment:', error);
    }
  };

  useEffect(() => {
    // Set the navigation options dynamically
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Save"
          onPress={handleAddAppointment}
          color="#e35622" // Change the background color
          style={{
            marginBottom: 10, // Add margin bottom
            borderRadius: 30, // Add border radius
          }}
          titleStyle={{
            color: "white",
            fontWeight: "bold",
          }}  />
      ),
    });
  }, [title, date]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Add Task</Text>
      <TextInput
        placeholder="Task Details"
        value={title}
        onChangeText={(text) => setTitle(text)}
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
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 16,
  },
  datePicker: {
    marginBottom: 16,
  },
});

export default AddAppointmentScreen;
