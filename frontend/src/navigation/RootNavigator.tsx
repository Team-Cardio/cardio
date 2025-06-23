import React from 'react';
import { Text } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import HostScreen from '../screens/HostScreen';
import PlayerTabNavigator from './PlayerTabNavigator';
import { RootStackParamList } from '../types/navigation';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import PlayerJoinCodeScreen from '../screens/PlayerJoinCodeScreen';
import HostJoinCodeScreen from '../screens/HostJoinCodeScreen';
import CreateRoomSettings from '../screens/CreateRoomSettings';

const Stack = createNativeStackNavigator<RootStackParamList>();

const config = {
    path: 'app',
    screens: {
        Home: 'home',
        Host: 'host/:code',
        PlayerJoinCode: 'player/join',
        HostJoinCode: "host/join",
        Player: {
            path: 'player/:code',
            screens: {
                Tab1: 'tab1',
                Tab2: 'tab2',
                Tab3: 'tab3'
            }
        },
    },
}

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['myapp://', 'https://myapp.com'],
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
                <Stack.Screen name="Host" component={HostScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Player" component={PlayerTabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="PlayerJoinCodeScreen" component={PlayerJoinCodeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="HostJoinCodeScreen" component={HostJoinCodeScreen} options={{ headerShown: false }} />
                <Stack.Screen name="CreateRoomSettings" component={CreateRoomSettings} options={{ headerShown: false }} />
            </Stack.Navigator>
        </ NavigationContainer>
    );
}
