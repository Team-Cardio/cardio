import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  moneyAmount: number
}

export default function AddChipButton({ moneyAmount }: Props) {
  return (
    <View style={styles.button}>
      <Text style={styles.buttonText}>${moneyAmount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 120,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#aaa',
    borderColor: '#222',
    borderWidth: 2,
    margin: -10,
    zIndex: 1,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '500',
  },
});