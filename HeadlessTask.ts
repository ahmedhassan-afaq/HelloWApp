import { DeviceEventEmitter } from 'react-native';

// Define HeadlessJsTaskError locally since it's not exported from react-native
class HeadlessJsTaskError extends Error {
  constructor() {
    super('HeadlessJsTaskError');
    this.name = 'HeadlessJsTaskError';
  }
}

module.exports = async (taskData: any) => {
  const startMessage = 'Headless JS Task started with data: ' + JSON.stringify(taskData);
  console.log(startMessage);
  DeviceEventEmitter.emit('HeadlessTaskMessage', startMessage);
  
  // Create a loop that runs for a specified duration
  const startTime = Date.now();
  const duration = taskData.duration || 30000; // Default 30 seconds
  let counter = 0;
  
  while (Date.now() - startTime < duration) {
    counter++;
    const message = `Headless JS Task - Iteration ${counter}`;
    console.log(message);
    DeviceEventEmitter.emit('HeadlessTaskMessage', message);
    
    // Add a small delay to prevent excessive logging
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Optional: Check for specific conditions that might require retry
    if (taskData.shouldRetry && counter % 10 === 0) {
      const retryMessage = 'Simulating retry condition...';
      console.log(retryMessage);
      DeviceEventEmitter.emit('HeadlessTaskMessage', retryMessage);
      throw new HeadlessJsTaskError();
    }
  }
  
  const completionMessage = `Headless JS Task completed after ${counter} iterations`;
  console.log(completionMessage);
  DeviceEventEmitter.emit('HeadlessTaskMessage', completionMessage);
  DeviceEventEmitter.emit('HeadlessTaskCompleted', {});
}; 