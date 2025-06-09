import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ControllButtonProps {
  onPress: () => void;
  title: string;
}

export default function ControllButton({ onPress, title }: ControllButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 120,
    borderColor: '#222',
    borderWidth: 2,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#aaa',
    fontSize: 18,
    fontWeight: '500',
  },
});