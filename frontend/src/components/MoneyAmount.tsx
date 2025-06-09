import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface Props {
  moneyAmount: number
  highLightStyles?: StyleProp<ViewStyle>,
}

export default function AddChipButton({ moneyAmount, highLightStyles }: Props) {
  return (
    <View style={[styles.button, highLightStyles]}>
      <Text style={styles.buttonText}>${moneyAmount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 40,
    width: 160,
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(222,222,222,0.5)',
    borderColor: '#222',
    borderWidth: 2,
    margin: -10,
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: '500',
  },
});