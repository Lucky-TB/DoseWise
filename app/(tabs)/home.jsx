import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const Home = () => {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-[#161622] p-4">
      <StatusBar backgroundColor='#161622' style='light' />
      
      <Text className="text-white text-3xl font-bold mb-4">Current Medications</Text>
      
      <View className="bg-[#232533] p-4 rounded-lg w-full mb-6">
        <Text className="text-white text-lg font-semibold">Medication List:</Text>
        {/* Example medication items */}
        <Text className="text-gray-400">- Medication A</Text>
        <Text className="text-gray-400">- Medication B</Text>
        <Text className="text-gray-400">- Medication C</Text>
      </View>

      <TouchableOpacity 
        onPress={() => router.push('/verify')}
        className="bg-[#90EE90] p-3 rounded-lg w-full mb-4"
      >
        <Text className="text-[#161622] text-center font-bold">Scan Medication</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        onPress={() => router.push('/reminder')}
        className="bg-[#90EE90] p-3 rounded-lg w-full"
      >
        <Text className="text-[#161622] text-center font-bold">View Alerts</Text>
      </TouchableOpacity>
      
      <View className="absolute bottom-4 left-0 right-0 items-center">
        <Text className="text-gray-400 text-lg">Quick Reminders</Text>
        {/* Example reminders */}
        <Text className="text-gray-400">- Take Medication A</Text>
        <Text className="text-gray-400">- Check your dosage</Text>
      </View>
    </View>
  );
};

export default Home;
