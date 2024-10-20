import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

const DrugEntryScreen = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [modalVisiblemanual, setModalVisiblemanual] = useState(false);
  const [modalVisiblescan, setModalVisiblescan] = useState(false);
  const [drugName, setDrugName] = useState('');
  const [scaleAnim] = useState(new Animated.Value(0));
  const router = useRouter();

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  const handleSubmit = () => {
    if (selectedOption === 'enter') {
      openModalmanual();
    } else if (selectedOption === 'scan') {
      openModalscan();
    }
  };

  const openModalmanual = () => {
    setModalVisiblemanual(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const closeModalmanual = () => {
    setModalVisiblemanual(false);
  };

  const handleModalSubmitmanual = () => {
    console.log('Submitted Drug Name:', drugName);
    closeModalmanual();
    setDrugName('');
    router.push({ pathname: './medi', params: { showModal: true } });
  };


  const openModalscan = () => {
    setModalVisiblescan(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const closeModalscan = () => {
    setModalVisiblescan(false);
  };

  const handleModalSubmitscan = () => {
    closeModalscan();
    router.push({ pathname: './medi', params: { showModal: true } });
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#161622] p-4">
      <StatusBar backgroundColor='#161622' style='light' />

      <Text className="text-white text-3xl font-bold mb-4">Drug Name</Text>

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
        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleSubmit}
        >
          <Text className="text-[#161622] text-center font-bold">Submit</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisiblemanual}
        animationType="none"
        onRequestClose={closeModalmanual}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
            <Text className="text-white text-lg font-semibold mb-2">Enter Drug Name:</Text>
            <TextInput
              style={styles.input}
              placeholder="Drug Name"
              placeholderTextColor="#aaa"
              value={drugName}
              onChangeText={setDrugName}
            />
            <TouchableOpacity style={styles.submitButton} onPress={handleModalSubmitmanual}>
              <Text className="text-[#161622] text-center font-bold">Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeModalmanual}>
              <Text className="text-[#161622] text-center font-bold">Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={modalVisiblescan}
        animationType="none"
        onRequestClose={closeModalscan}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
            <Text className="text-white text-lg font-semibold mb-2">Stupid Idiot:</Text>
            <TouchableOpacity style={styles.submitButton} onPress={handleModalSubmitscan}>
              <Text className="text-[#161622] text-center font-bold">Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeModalscan}>
              <Text className="text-[#161622] text-center font-bold">Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
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
    backgroundColor: '#272734',
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