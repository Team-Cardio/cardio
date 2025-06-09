import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import CodeForm from '../components/CodeForm';
import { ImageBackground, StyleSheet } from 'react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'HostJoinCodeScreen'>;

export default function HostJoinCodeScreen({ navigation }: Props) {
    const [code, setCode] = useState<string>("");

    return (
        <ImageBackground
          source={require('@/assets/images/photo7.avif')}
          resizeMode="cover"
          style={styles.background}
        >
            <CodeForm title='Rejoin as a Host' navigate={(code) => navigation.navigate("Host", { code })} />
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


