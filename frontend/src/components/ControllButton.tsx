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
    margin: 2,
    borderWidth: 0,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  buttonText: {
    color: '#aaa',
    fontSize: 18,
    fontWeight: '500',
  },
});