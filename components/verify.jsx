import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const DrugEntryScreen = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [scaleAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#161622', padding: 16 }}>
      <StatusBar backgroundColor='#161622' style='light' />

      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Drug Name</Text>

      <View style={{ backgroundColor: '#232533', padding: 16, borderRadius: 8, width: '100%', marginBottom: 24 }}>
        <Text style={{ color: 'white', fontSize: 18, fontWeight: '600' }}>Select Option:</Text>
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
        >
          <Text style={{ color: '#161622', textAlign: 'center', fontWeight: 'bold' }}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    backgroundColor: '#1f1f2e',
    borderRadius: 20,
    padding: 30,
    width: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  input: {
    backgroundColor: '#27273',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#90EE90',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
  closeButton: {
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    marginTop: 10,
  },
});

export default DrugEntryScreen;