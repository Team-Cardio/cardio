import React from 'react';
import { Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import HostScreen from '../screens/HostScreen';
import PlayerTabNavigator from './PlayerTabNavigator';
import { RootStackParamList } from '../types/navigation';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const config = {
    path: 'app',
    screens: {
        Home: 'home',
        Host: 'host',
        Player: {
            screens: {
                Tab1: 'player/tab1',
                Tab2: 'player/tab2',
                Tab3: 'player/tab3'
            }
        },
    },
}

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['http://localhost:8081'],
    config
};

export default function RootNavigator() {
    return (
        <NavigationContainer
            linking={linking}
            fallback={<Text>Loading...</Text>}
        >
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Host" component={HostScreen} />
                <Stack.Screen name="Player" component={PlayerTabNavigator} options={{ headerShown: false }} />
            </Stack.Navigator>
        </ NavigationContainer>
    );
}
