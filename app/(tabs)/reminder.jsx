import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Checkbox } from 'react-native-paper'; // Use react-native-paper Checkbox
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);
  const [medication, setMedication] = useState('');
  const [reminders, setReminders] = useState([]);
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Set notification handler to allow notifications in the foreground (iOS specific)
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  useEffect(() => {
    const requestPermission = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permission for notifications is required!');
        }
      }
    };
    requestPermission();
  }, []);

  const scheduleNotification = () => {
    if (medication.length === 0) {
      Alert.alert("Please enter a medication name.");
      return;
    }

    const now = new Date();
    const secondsUntilNotification = Math.floor((notificationTime.getTime() - now.getTime()) / 1000);

    if (secondsUntilNotification <= 0) {
      Alert.alert("Please choose a time in the future.");
      return;
    }

    // Schedule the notification
    Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder",
        body: `It’s time to take your medication: ${medication}!`,
      },
      trigger: {
        seconds: secondsUntilNotification,
      },
    });

    // Add the reminder to the list
    setReminders(prevReminders => [
      ...prevReminders,
      { id: Date.now(), name: medication, completed: false, time: notificationTime.toLocaleTimeString() }
    ]);

    // Reset the state
    setMedication('');
    setModalVisible(false);
    setShowTimePicker(false);
  };

  const toggleCompletion = (id) => {
    setReminders(prevReminders =>
      prevReminders.map(reminder =>
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medication Reminder App</Text>

      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Add Alert</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Medication Alert</Text>
            <TextInput
              style={styles.input}
              placeholder="What medication do you want to add?"
              placeholderTextColor="#aaa"
              value={medication}
              onChangeText={setMedication}
            />
            
            <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
              <Text style={styles.buttonText}>
                Set Notification Time: {notificationTime.toLocaleTimeString()}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={notificationTime}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || notificationTime;
                  setShowTimePicker(false);
                  setNotificationTime(currentDate);
                }}
              />
            )}

            <TouchableOpacity style={styles.saveButton} onPress={scheduleNotification}>
              <Text style={styles.buttonText}>Save Alert</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <Checkbox
              status={item.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleCompletion(item.id)}
            />
            <Text style={[styles.reminderText, item.completed && styles.completed]}>
              {item.name} - {item.time}
            </Text>
          </View>
        )}
        style={styles.reminderList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622', // Blackish background
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white', // White text for contrast
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#32cd32', // Vibrant green button
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    shadowColor: '#32cd32', // Green shadow effect
    shadowOpacity: 0.5,
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)', // Dark translucent background
  },
  modalContent: {
    backgroundColor: '#1f1f2e', // Dark grayish modal background
    borderRadius: 20,
    padding: 30,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000', // Subtle shadow
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    color: '#fff', // White text
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#272734', // Darker input field
    color: 'white', // White text
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  timeButton: {
    backgroundColor: '#32cd32', // Green button for time selection
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#32cd32', // Save button in green
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#444', // Subtle close button
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  reminderList: {
    width: '100%',
    marginTop: 20,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272734', // Background for list items
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  reminderText: {
    color: 'white', // White text for list items
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  completed: {
    textDecorationLine: 'line-through', // Strike-through for completed reminders
    color: '#aaa', // Grayed-out completed items
  },
});