import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const HomeScreen = ({ navigation }) => {
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await AsyncStorage.getItem("appointments");
      if (data !== null) {
        const appointments = JSON.parse(data);

        const pending = appointments.filter((appointment) => !appointment.status);
        const completed = appointments.filter((appointment) => appointment.status);

        setPendingAppointments(pending);
        setCompletedAppointments(completed);
      }
    } catch (error) {
      console.error("Error reading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsDone = async (appointment) => {
    try {
      const updatedPendingAppointments = pendingAppointments.filter(
        (appt) => appt.id !== appointment.id
      );
      const updatedCompletedAppointments = [
        ...completedAppointments,
        { ...appointment, status: true },
      ];

      setPendingAppointments(updatedPendingAppointments);
      setCompletedAppointments(updatedCompletedAppointments);

      const updatedAppointments = updatedPendingAppointments.concat(
        updatedCompletedAppointments
      );

      await AsyncStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    } catch (error) {
      console.error("Error marking appointment as done:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const updatedPendingAppointments = pendingAppointments.filter(
        (appointment) => appointment.id !== id
      );
      const updatedCompletedAppointments = completedAppointments.filter(
        (appointment) => appointment.id !== id
      );

      setPendingAppointments(updatedPendingAppointments);
      setCompletedAppointments(updatedCompletedAppointments);

      const updatedAppointments = updatedPendingAppointments.concat(
        updatedCompletedAppointments
      );

      await AsyncStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.work}>
      <MaterialIcons name="description" size={20} color="#e35622" />
        {item.title}
      </Text>
      <Text style={styles.time}>
      <AntDesign name="calendar" size={20} color="#e35622" />
           {moment(item.date).format("LLL")}</Text>
      {!item.status && (
        
       <Button
       title="Mark as Done"
       onPress={() => handleMarkAsDone(item)}
       color="#e35622" // Change the background color
       style={{
         marginBottom: 10, // Add margin bottom
         borderRadius: 30, // Add border radius
       }}
       titleStyle={{
         color: "white",
         fontWeight: "bold",
       }} // Style the text
     />
     )}
      
      <Button
        title="Update"
        onPress={() =>
          navigation.navigate("EditAppointment", {
            appointment: item,
            onUpdate: handleUpdate,
          })
        }
      />
     
     <Button
  title="Delete"
  onPress={() => handleDelete(item.id)}
  color="red" // Change the background color
  titleStyle={{ color: "white", fontWeight: "bold" }} // Style the text
/>
    </View>
  );

  const handleUpdate = (updatedAppointment) => {
    const updatedPendingAppointments = pendingAppointments.map((appt) =>
      appt.id === updatedAppointment.id ? updatedAppointment : appt
    );
    const updatedCompletedAppointments = completedAppointments.map((appt) =>
      appt.id === updatedAppointment.id ? updatedAppointment : appt
    );

    setPendingAppointments(updatedPendingAppointments);
    setCompletedAppointments(updatedCompletedAppointments);
  };

  const handleAppointmentAdded = () => {
    fetchData();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Task List <FontAwesome5 name="tasks" size={33} color="#A573F0" /></Text>
      {loading && <Text>Loading...</Text>}
      {!loading && pendingAppointments.length === 0 && completedAppointments.length === 0 && (
        
        <Image source={require("../assets/ta.jpg")} style={styles.picture} />
      )}
     
      {!loading && (pendingAppointments.length > 0 || completedAppointments.length > 0) && (
        <>
          {pendingAppointments.length > 0 && (
            <>
              <Text style={styles.tasks}>Pending Tasks:</Text>
              <FlatList
                data={pendingAppointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
              />
            </>
          )}
          {completedAppointments.length > 0 && (
            <>
              <Text style={styles.tasks}>Completed Tasks:</Text>
              <FlatList
                data={completedAppointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderItem}
              />
            </>
          )}
        </>
      )}
      <Button
        title="Add New Task"
        onPress={() =>
          navigation.navigate("AddAppointment", {
            onAppointmentAdded: handleAppointmentAdded,
          })}
        style={styles.click}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "white",
    borderRadius: 30,
  },
  heading: {
    fontSize: 39,
    fontWeight: "900",
    marginBottom: 16,
    color: "#e35622",
    textAlign: "center",
  },
  appointmentItem: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e35622",
    padding: 16,
    borderRadius: 15,
  },
  tasks: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#a573f0",
  },

  click: {
    marginTop: 16,
    padding: 10,
  },
  picture: {
    width: 300,
    height: 400,
    marginBottom: 30,
    alignSelf: "center",
  },
  work: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#a573f0",
    
  },
  time:{
    fontSize : 14
  }
});

export default HomeScreen;
