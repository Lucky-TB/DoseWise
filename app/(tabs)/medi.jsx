import React, { useState, useEffect, useRef } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar as RNStatusBar,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { StatusBar } from 'expo-status-bar';
import { GEMINI_API_KEY } from '@env';

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const startChat = async () => {
      try {
        const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const prompt = "hello!";
        const result = await model.generateContent(prompt);

        if (result && result.response) {
          const text = result.response.text ? result.response.text() : "No response available.";
          showMessage({
            message: "Welcome to Gemini Chat 🤖",
            description: text,
            type: "info",
            icon: "info",
            duration: 2000,
          });
          setMessages([{ text, user: false }]);
        } else {
          console.error("Response is undefined or does not have the expected structure", result);
          showMessage({
            message: "Error",
            description: "Failed to start chat. Please try again.",
            type: "danger",
          });
        }
      } catch (error) {
        console.error("Error in startChat:", error);
        showMessage({
          message: "Error",
          description: "An error occurred while starting the chat.",
          type: "danger",
        });
      }
    };
    startChat();
  }, []);

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    try {
      setLoading(true);
      const userMessage = { text: userInput, user: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);

      
      if (!userInput || userInput.trim().length < 2) {
        const errorMessage = { text: "Sorry, I didn't understand that.", user: false };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        setUserInput("");
        return;
      }

      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = userMessage.text;

      const fetchContent = async (retries = 3) => {
        try {
          const result = await model.generateContent(prompt);

          if (result && result.response) {
            const text = result.response.text ? result.response.text() : "No response available.";
            setMessages((prevMessages) => [...prevMessages, { text, user: false }]);
          } else {
            console.error("Response is undefined or does not have the expected structure", result);
            showMessage({
              message: "Error",
              description: "Failed to generate a response. Please try again.",
              type: "danger",
            });
          }
        } catch (error) {
          if (error.message.includes("503") && retries > 0) {
            console.log(`Retrying... Attempts left: ${retries}`);
            setTimeout(() => fetchContent(retries - 1), 2000);
          } else {
            console.error("Error in fetchContent:", error);
            showMessage({
              message: "Error",
              description: "The service is currently overloaded. Please try again later.",
              type: "danger",
            });
          }
        }
      };

      await fetchContent();
    } catch (error) {
      console.error("Error in sendMessage:", error);
      showMessage({
        message: "Error",
        description: "An error occurred while sending the message.",
        type: "danger",
      });
    } finally {
      setLoading(false);
      setUserInput("");
    }
  };

  const renderMessage = ({ item }) => (
    <View
      className={`p-3 my-1 rounded-lg shadow-sm ${
        item.user ? "bg-[#90EE90] self-end" : "bg-[#232533] self-start"
      } max-w-[80%]`}
      style={{ marginHorizontal: 0 }}
    >
      <Text className={`${item.user ? "text-[#161622]" : "text-gray-400"} text-lg`}>
        {item.text}
      </Text>
    </View>
  );

  return (
    <View className="flex-1 items-center justify-center bg-[#161622] p-4">
      <RNStatusBar 
        barStyle="light-content" 
        backgroundColor='#161622' 
        translucent={false} 
      />
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        className="flex-1 mb-16 pt-10 pb-4"
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View className="flex-row items-center bg-[#232533] p-3 rounded-full shadow-md">
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          className="flex-1 mx-3 p-3 bg-[#d3e1d1] rounded-full shadow-sm text-gray-800 placeholder-gray-500"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          className="bg-[#90EE90] p-3 rounded-full shadow-md"
          onPress={sendMessage}
        >
          <FontAwesome name="paper-plane" size={24} color="black" />
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#4B5563" className="ml-2"/>}
      </View>
    </View>
  );
};

export default GeminiChat;