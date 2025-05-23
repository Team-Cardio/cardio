import React from 'react';
import { Button, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type GoHomeButton = { title?: string };

function GoHomeButton({ title = "Go to Home Screen" }: GoHomeButton) {
  const navigation = useNavigation<HomeNavigationProp>();

  return (
    <View style={{ padding: 10 }}>
      <Button
        title={title}
        onPress={() =>
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          })
        }
        color="#555"
      />
    </View>
  );
}

export default GoHomeButton;
