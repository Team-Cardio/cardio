import React from 'react';
import { View, Image, Button, StyleSheet, useWindowDimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import Background from '../components/Background';
import MainButton from '../components/MainButton';

const LogoSource = require('@/assets/images/logo.png');

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
    const { width } = useWindowDimensions();
    const isNarrow = width < 768;

    return (
        <View style={styles.container}>
          <Background source={require("@/assets/images/photo2.jpg")}>
            <Image source={LogoSource} style={styles.image} />
            <View style={[styles.buttonContainer, isNarrow ? {} : styles.desktopButtonContainer]}>
                <MainButton title="Create a Room" onPress={() => navigation.navigate('CreateRoomSettings')} />
            </View>
            <View style={[styles.buttonContainer, isNarrow ? {} : styles.desktopButtonContainer]}>
                <MainButton title="Rejoin as a Host" onPress={() => navigation.navigate('HostJoinCodeScreen')} />
            </View>
            <View style={[styles.buttonContainer, isNarrow ? {} : styles.desktopButtonContainer]}>
                <MainButton title="Join as a Player" onPress={() => navigation.navigate('PlayerJoinCodeScreen')} />
            </View>
            </Background>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
      width: 200,
      height: 200,
      margin: 20,
    },
    buttonContainer: {
        width: '80%',
        marginBottom: 20,
    },
    desktopButtonContainer: {
        width: 300,
    },
});
