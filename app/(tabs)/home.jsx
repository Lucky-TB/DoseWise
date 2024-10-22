import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const Home = ({ reminders = [], deleteReminder }) => {
  const router = useRouter();

  const handleModalSubmitmanual = () => {
    router.push({ pathname: './medi', params: { showModal: true } });
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#161622] p-4">
      <StatusBar backgroundColor='#161622' style='light' />

      <Text className="text-white text-3xl font-bold mb-4">Current Medications</Text>

      <View className="bg-[#232533] p-4 rounded-lg w-full mb-6">
        <Text className="text-white text-lg font-semibold">Medication List:</Text>
        {reminders.length > 0 ? (
          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Text style={{ color: 'white', flex: 1 }}>
                  {item.name} - {item.time}
                </Text>
                <TouchableOpacity onPress={() => deleteReminder(item.id)}>
                  <AntDesign name="closecircle" size={24} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text className="text-gray-400">No medications added yet.</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => router.push('/verify')}
        className="bg-[#71c9ce] p-3 rounded-lg w-full mb-4"
      >
        <Text className="text-[#161622] text-center font-bold">Scan Medication</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/reminder')}
        className="bg-[#71c9ce] p-3 rounded-lg w-full mb-4"
      >
        <Text className="text-[#161622] text-center font-bold">View Alerts</Text>
      </TouchableOpacity>

      {/* Ensure the button is styled and visible */}
      <TouchableOpacity
        className="bg-[#71c9ce] p-3 rounded-lg w-full"
        onPress={handleModalSubmitmanual}
      >
        <Text style={{ color: '#161622', textAlign: 'center', fontWeight: 'bold' }}>Verify Your Drug</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
