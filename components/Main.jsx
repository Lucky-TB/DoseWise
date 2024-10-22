import React, { useState } from 'react';
import { View } from 'react-native';
import Home from '../tabs/home';
import Reminder from '../tabs/reminder';

const Main = () => {
  const [reminders, setReminders] = useState([]);

  const addReminder = (newReminder) => {
    setReminders((prevReminders) => [...prevReminders, newReminder]);
  };

  const toggleCompletion = (id) => {
    setReminders((prevReminders) =>
      prevReminders.map((reminder) =>
        reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
      )
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Home reminders={reminders} deleteReminder={deleteReminder} />
      <Reminder addReminder={addReminder} reminders={reminders} toggleCompletion={toggleCompletion} />
    </View>
  );
};

export default Main;