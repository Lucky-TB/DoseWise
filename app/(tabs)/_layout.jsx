import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const TabIcon = ({ iconName, color, name, focused }) => {
  return (
    <View className="items-center justify-center gap-2 mt-4">
      <MaterialCommunityIcons
        name={iconName}
        size={focused ? 28 : 24} // Increase size when focused
        color={color}
      />
      <Text
        className={`${focused ? 'font-psemibold pt-1' : 'font-pregular'} text-xs`}
        style={{ color: color, fontSize: focused ? 14 : 12 }}
      >
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
        tabBarActiveTintColor: '#71c9ce',
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
              iconName="home"
              color={color}
              name="Home"
              focused={focused}
            />
          ),
        }}
      />
      {/*<Tabs.Screen
        name="verify"
        options={{
          title: 'Verify',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconName="check-circle"
              color={color}
              name="Verify"
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
              iconName="alarm"
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
              iconName="pill"
              color={color}
              name="Medi"
              focused={focused}
            />
          ),
        }}
      />
      {/*<Tabs.Screen
        name="test"
        options={{
          title: 'test',
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              iconName="pill"
              color={color}
              name="test"
              focused={focused}
            />
          ),
        }}
      />*/}
    </Tabs>
  );
};

export default TabsLayout;
