import React from 'react';
import { Image, View, Button, StyleSheet, useWindowDimensions, ImageBackground, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import MainButton from '../components/MainButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const LogoSource = require('@/assets/images/logo.png')

export default function HomeScreen({ navigation }: Props) {
    const { width } = useWindowDimensions();
    const isNarrow = width < 768;

    return (
        <ImageBackground
          source={require('@/assets/images/photo2.jpg')}
          resizeMode="cover"
          style={styles.background}
        >
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
      },
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
