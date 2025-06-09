import React from 'react';
import {StyleSheet, TouchableOpacity, Text} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type GoHomeButton = { title?: string };

export default function GoHomeButton({ title = "Go to Home Screen" }: GoHomeButton) {
  const navigation = useNavigation<HomeNavigationProp>();
  return (
    <TouchableOpacity style={styles.button} onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        }>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    width: 200,
    borderWidth: 0,
    borderRadius: 10,
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
