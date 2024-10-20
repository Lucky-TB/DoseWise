import React, { useState, useEffect, useRef } from "react";
import * as GoogleGenerativeAI from "@google/generative-ai";
import { useRoute } from '@react-navigation/native'; 
import {
  View,
  Text,
  TextInput,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar as RNStatusBar,
  Modal,
  Animated,
  StyleSheet,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { GEMINI_API_KEY } from '@env';

const GeminiChat = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [scaleAnim] = useState(new Animated.Value(0));

  const route = useRoute(); 
  
  const openModal = () => {
    setModalVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
      setModalVisible(false);
  };

  useEffect(() => {
    if (route.params?.showModal) {
      openModal();
    }
  }, [route.params]);

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
      style={[
        styles.messageBubble,
        item.user ? styles.userBubble : styles.botBubble,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.user ? styles.userText : styles.botText,
        ]}
        numberOfLines={5} // Limit to 5 lines (adjust as needed)
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
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
        contentContainerStyle={{ paddingBottom: 10 }}
        style={{ flexGrow: 1, paddingTop:50 }} // Allow the FlatList to grow
      />
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Type a message"
          onChangeText={setUserInput}
          value={userInput}
          style={styles.input}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={sendMessage}
        >
          <FontAwesome name="paper-plane" size={24} color="black" />
        </TouchableOpacity>
        {loading && <ActivityIndicator size="large" color="#4B5563" style={styles.loadingIndicator}/>}
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="none"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.modalTitle}>Scan Barcode</Text>
            <Text style={styles.modalText}>Camera functionality can be added here.</Text>

            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161622',
    padding: 10,
    justifyContent: 'center',
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '90%',  // Maintain max width
    alignSelf: 'stretch', // Stretch the bubble across available width
    overflow: 'hidden', // Ensure any overflowing text is hidden
  },
  userBubble: {
    backgroundColor: '#90EE90',
    alignSelf: 'flex-end', // Align user messages to the right
  },
  botBubble: {
    backgroundColor: '#232533',
    alignSelf: 'flex-start', // Align bot messages to the left
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    color: 'white', // Default text color for better visibility
    flexWrap: 'wrap', // Allow text to wrap
  },
  userText: {
    color: '#161622',
  },
  botText: {
    color: 'gray',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#232533',
    paddingVertical: 15, // Increase vertical padding
    paddingHorizontal: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#d3e1d1',
    borderRadius: 20,
    paddingHorizontal: 15,
    color: '#333',
    height: 40, // Set a specific height for the input box
  },
  sendButton: {
    backgroundColor: '#90EE90',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  loadingIndicator: {
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#4B5563',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
  },
});

export default GeminiChat;