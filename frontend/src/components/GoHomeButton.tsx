import React from 'react';
import { Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type HomeNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function GoHomeButton() {
    const navigation = useNavigation<HomeNavigationProp>();

    return (
        <Button
            title="Go to Home"
            onPress={() =>
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                })
            }
        />
    );
}

export default GoHomeButton;
