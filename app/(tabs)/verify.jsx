import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';

const DrugEntryScreen = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [drugName, setDrugName] = useState('');

  const handleOptionChange = (value) => {
    setSelectedOption(value);
    if (value === 'enter') {
      setModalVisible(true);
    } else {
      // Here you can navigate to the barcode scanning page
      console.log('Navigate to barcode scanning page');
    }
  };

  const handleSubmit = () => {
    // Handle the submission of the drug name here
    console.log('Submitted Drug Name:', drugName);
    setModalVisible(false);
    setDrugName(''); // Clear the input field after submission
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#161622] p-4">
      <StatusBar backgroundColor='#161622' style='light' />

      <Text className="text-white text-3xl font-bold mb-4">Enter Drug Details</Text>

      <View className="bg-[#232533] p-4 rounded-lg w-full mb-6">
        <Text className="text-white text-lg font-semibold">Select Option:</Text>
        <Picker
          selectedValue={selectedOption}
          onValueChange={(itemValue) => handleOptionChange(itemValue)}
          style={{ color: 'white' }}
        >
          <Picker.Item label="Select..." value="" />
          <Picker.Item label="Enter Manually" value="enter" />
          <Picker.Item label="Scan Barcode" value="scan" />
        </Picker>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text className="text-white text-lg font-semibold mb-2">Enter Drug Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Drug Name"
              placeholderTextColor="#aaa"
              value={drugName}
              onChangeText={setDrugName}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text className="text-[#161622] text-center font-bold">Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#232533',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: '#d3e1d1',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#90EE90',
    padding: 10,
    borderRadius: 5,
    width: '100%',
  },
});

export default DrugEntryScreen;