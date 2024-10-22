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
  const [drugName, setDrugName] = useState("");
  const [Allergies, setAllergies] = useState("");
  const [Symptoms, setSymptoms] = useState("");
  const [Disease, setDisease] = useState("");
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

  const sendModalInfo = async () => {
    closeModal(); // Close the modal after sending the info

    const combinedMessage = `
      Take this information and tell the user if this is the best drug the user should take. Give it information about the disease and drug and finally be caring and helpful
      Drug The User is Taking: ${drugName}
      Disease: ${Disease}
      Symptoms: ${Symptoms}
      Allergies: ${Allergies}
    `;

    // Do not show the combined message in the chat
    try {
      const genAI = new GoogleGenerativeAI.GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const fetchContent = async (retries = 3) => {
        try {
          const result = await model.generateContent(combinedMessage);

          if (result && result.response) {
            const text = result.response.text ? result.response.text() : "No response available.";
            // Append the response to messages without showing the combined message
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
      console.error("Error in sendModalInfo:", error);
      showMessage({
        message: "Error",
        description: "An error occurred while sending the modal information.",
        type: "danger",
      });
    } finally {
      setAllergies(""); // Reset inputs after sending
      setSymptoms("");
      setDisease("");
      setDrugName("");
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
        // Allow multiple lines for the chatbot's response
        numberOfLines={0} 
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
        {loading && <ActivityIndicator size="large" color="#4B5563" style={styles.loadingIndicator} />}
      </View>

      <Modal animationType="slide" visible={modalVisible} transparent>
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.modalContainer, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Enter Drug Information</Text>
              <TextInput
                placeholder="Drug Name"
                value={drugName}
                onChangeText={setDrugName}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Allergies"
                value={Allergies}
                onChangeText={setAllergies}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Symptoms"
                value={Symptoms}
                onChangeText={setSymptoms}
                style={styles.modalInput}
              />
              <TextInput
                placeholder="Disease"
                value={Disease}
                onChangeText={setDisease}
                style={styles.modalInput}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={sendModalInfo}
              >
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
      <FlashMessage position="top" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
    paddingHorizontal: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "white",
    marginRight: 10,
  },
  sendButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  messageBubble: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  userBubble: {
    backgroundColor: "#4B5563",
    alignSelf: "flex-end",
  },
  botBubble: {
    backgroundColor: "#2C2A38",
    alignSelf: "flex-start",
  },
  messageText: {
    color: "#fff",
  },
  loadingIndicator: {
    position: "absolute",
    right: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
  },
  modalContent: {
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    width: "100%",
  },
  submitButton: {
    backgroundColor: "#4B5563",
    borderRadius: 10,
    padding: 10,
    width: "100%",
    alignItems: "center",
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: "#4B5563",
  },
});

export default GeminiChat;