import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, TouchableOpacity } from 'react-native';
import Animated from 'react-native-reanimated';

type Props = {
  count100: Animated.SharedValue<number>;
  count50: Animated.SharedValue<number>;
  count25: Animated.SharedValue<number>;
  count5: Animated.SharedValue<number>;
  count1: Animated.SharedValue<number>;
  onRefresh: () => void;
};

const ChipCalculator = ({
  count100,
  count50,
  count25,
  count5,
  count1,
  onRefresh,
}: Props) => {
  const [input, setInput] = useState('');

  const calculateChips = (amount: number) => {
    count100.value = Math.max(Math.floor((amount - 200) / 100), 0);
    amount -= 100*count100.value;
    count50.value = Math.max(Math.floor((amount - 100) / 50), 0);
    amount -= 50*count50.value;
    count25.value = Math.max(Math.floor((amount - 10) / 25), 0);
    amount -= 25*count25.value;
    count5.value = Math.max(Math.floor((amount - 3) / 5), 0);
    amount -= 5*count5.value;
    count1.value = amount;
  };

  const handleChange = (text: string) => {
    setInput(text);
    const numeric = parseInt(text);
    if (!isNaN(numeric)) {
      calculateChips(numeric);
    } else {
      count100.value = 0;
      count50.value = 0;
      count25.value = 0;
      count5.value = 0;
      count1.value = 0;
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={input}
        onChangeText={handleChange}
        placeholder=""
      />
      <TouchableOpacity style={styles.button} onPress={onRefresh}>
        <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(255, 255, 255, 0)',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    color: 'white',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 8,
    marginTop: 6,
    fontSize: 18,
    
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#eee',
    color: 'white',
    opacity: 0.5,
    width: 80,
    height: 40,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ChipCalculator;
