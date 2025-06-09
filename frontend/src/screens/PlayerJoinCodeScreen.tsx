import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import CodeForm from '../components/CodeForm';
import { ImageBackground, StyleSheet } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'PlayerJoinCodeScreen'>;

export default function PlayerJoinCodeScreen({ navigation }: Props) {
    const [code, setCode] = useState<string>("");

    return (
        <ImageBackground
          source={require('@/assets/images/photo6.jpg')}
          resizeMode="cover"
          style={styles.background}
        >
          <CodeForm title='Join as a Player' navigate={(code) => navigation.navigate("Player", { code })} />
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

