import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface MainButtonProps {
  onPress: () => void;
  title: string;
}

export default function MainButton({ onPress, title }: MainButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    margin: 2,
    borderWidth: 0,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  buttonText: {
    color: '#eee',
    fontSize: 20,
    fontWeight: '500',
  },
});