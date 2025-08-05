/**
 * Headless JS Demo App
 * A simple app to demonstrate Headless JS functionality
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Button, Alert, Text, ScrollView, SafeAreaView } from 'react-native';
import { NativeModules, DeviceEventEmitter } from 'react-native';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [messages, setMessages] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const messageSubscription = DeviceEventEmitter.addListener('HeadlessTaskMessage', (msg: string) => {
      setMessages(prev => [...prev, msg]);
    });
    
    const completionSubscription = DeviceEventEmitter.addListener('HeadlessTaskCompleted', () => {
      setIsRunning(false);
    });
    
    return () => {
      messageSubscription.remove();
      completionSubscription.remove();
    };
  }, []);

  const startHeadlessTask = () => {
    try {
      // Clear previous messages
      setMessages([]);
      setIsRunning(true);
      
      // This will be implemented in the native module
      if (NativeModules.HeadlessTaskModule) {
        NativeModules.HeadlessTaskModule.startHeadlessTask({
          duration: 30000, // 30 seconds
          shouldRetry: true,
          message: 'Starting Headless JS Task'
        });
        Alert.alert('Success', 'Headless JS Task started! Watch the messages below.');
      } else {
        Alert.alert('Error', 'HeadlessTaskModule not found');
        setIsRunning(false);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to start Headless JS Task: ${error}`);
      setIsRunning(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#000' : '#fff' }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
          Headless JS Demo
        </Text>
        <Text style={[styles.headerSubtitle, { color: isDarkMode ? '#ccc' : '#666' }]}>
          Background Task Execution
        </Text>
      </View>
      
      {/* Messages Display */}
      <View style={styles.messagesContainer}>
        <View style={styles.messagesHeader}>
          <Text style={styles.messagesTitle}>Task Messages:</Text>
          <Button 
            title="Clear" 
            onPress={clearMessages}
            color="#FF3B30"
          />
        </View>
        <ScrollView style={styles.messagesScroll} showsVerticalScrollIndicator={false}>
          {messages.length === 0 ? (
            <Text style={styles.emptyText}>No messages yet. Start the task to see output.</Text>
          ) : (
            messages.map((msg, idx) => (
              <Text key={idx} style={styles.messageText}>
                {msg}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
      
      {/* Control Buttons */}
      <View style={styles.buttonContainer}>
        <Button 
          title={isRunning ? "Task Running..." : "Start Headless JS Task"} 
          onPress={startHeadlessTask}
          disabled={isRunning}
          color="#007AFF"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    margin: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
  },
  messagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  messagesTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  messagesScroll: {
    flex: 1,
  },
  messageText: {
    color: 'white',
    fontSize: 12,
    marginVertical: 2,
    fontFamily: 'monospace',
  },
  emptyText: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 20,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
  },
});

export default App;
