import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ControllButtonProps {
  onPress: () => void;
  title: string;
}

export default function AddChipButton({ onPress, title }: ControllButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 30,
    width: 100,
    borderRadius: 10,
    borderColor: '#222',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#555',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});