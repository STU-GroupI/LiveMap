// src/screens/EmptyScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const EmptyScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>No maps available. Please try again later</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 18,
    color: 'black',
  },
});

export default EmptyScreen;
