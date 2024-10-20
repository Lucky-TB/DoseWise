import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, FlatList } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Checkbox } from 'react-native-paper';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
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

    Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder",
        body: `It’s time to take your medication: ${medication}!`,
      },
      trigger: {
        seconds: secondsUntilNotification,
      },
    });

    const time = notificationTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setReminders(prevReminders => [
      ...prevReminders,
      { id: Date.now(), name: medication, completed: false, time }
    ]);

    setMedication('');
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
      <Text style={styles.title}>Reminders</Text>

      <TextInput
        style={styles.input}
        placeholder="What medication do you want to add?"
        placeholderTextColor="#ccc"
        value={medication}
        onChangeText={setMedication}
      />
      
      <TouchableOpacity 
        style={styles.timeButton} 
        onPress={() => setShowTimePicker(true)} // Show time picker directly
      >
        <Text style={styles.buttonText}>
          Set Reminder
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

      {reminders.length > 0 && <Text style={styles.upcomingAlertsTitle}>Upcoming Alerts</Text>}

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.reminderItem}>
            <Checkbox
              status={item.completed ? 'checked' : 'unchecked'}
              onPress={() => toggleCompletion(item.id)}
              color="#32cd32"
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
    backgroundColor: '#161622',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#90EE90',
    marginTop: 50,
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#272734',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#90EE90',
  },
  timeButton: {
    backgroundColor: '#90EE90',
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: '#90EE90',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  upcomingAlertsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#90EE90',
    marginTop: 20,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  reminderList: {
    width: '100%',
    marginTop: 20,
  },
  reminderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#272734',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  reminderText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
});