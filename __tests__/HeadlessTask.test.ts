import { AppRegistry } from 'react-native';

describe('Headless JS Task', () => {
  it('should register the headless task', () => {
    // This test verifies that the headless task is properly registered
    const mockTask = jest.fn();
    AppRegistry.registerHeadlessTask('TestTask', () => mockTask);
    
    // The registration should not throw an error
    expect(() => {
      AppRegistry.registerHeadlessTask('TestTask', () => mockTask);
    }).not.toThrow();
  });
}); 