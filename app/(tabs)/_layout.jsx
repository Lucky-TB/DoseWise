import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2 mt-4">
      {icon}
      <Text className={`${focused ? 'font-psemibold pt-1' : 'font-pregular'} text-xs`} style={{ color: color, fontSize: focused ? 15 : 12 }}>
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: '#90EE90',
        tabBarInactiveTintColor: '#CDCDE0',
        tabBarStyle: {
          backgroundColor: '#161622',
          borderTopWidth: 1,
          borderTopColor: '#232533',
          height: 84,
        },
        tabBarOnPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy); // Trigger haptic feedback
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={<MaterialCommunityIcons name="home" size={24} color={color} />}
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="verify"
        options={{
          title: 'Verify',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={<MaterialCommunityIcons name="check-circle" size={24} color={color} />}
              color={color}
              name="Verify"
              focused={focused}
            />
          ),
        }}
      />
      {/*<Tabs.Screen
        name="history"
        options={{
          title: 'History',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={<MaterialCommunityIcons name="history" size={24} color={color} />}
              color={color}
              name="History"
              focused={focused}
            />
          ),
        }}
      />*/}
      <Tabs.Screen
        name="reminder"
        options={{
          title: 'Reminder',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={<MaterialCommunityIcons name="alarm" size={24} color={color} />}
              color={color}
              name="Reminder"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="medi"
        options={{
          title: 'Medi',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={<MaterialCommunityIcons name="pill" size={24} color={color} />}
              color={color}
              name="Medi"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;