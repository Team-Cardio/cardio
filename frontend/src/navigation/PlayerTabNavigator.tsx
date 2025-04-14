import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlayerTab1 from '../screens/Player/PlayerTab1';
import PlayerTab2 from '../screens/Player/PlayerTab2';
import PlayerTab3 from '../screens/Player/PlayerTab3';
import { PlayerTabParamList, RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

const PlayerTabs = createBottomTabNavigator<PlayerTabParamList>();

function PlayerTabNavigator({ route }: Props) {
    const code = route.params.code
    return (
        <PlayerTabs.Navigator screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Table') {
                    iconName = 'table-furniture';
                } else if (route.name === 'Rankings') {
                    iconName = 'cards';
                } else if (route.name === 'Tab3') {
                    iconName = focused ? 'person' : 'person-outline';
                }

                return <MaterialCommunityIcons name={iconName} size={24} color="black" />
            },
            tabBarActiveTintColor: '#007aff',
            tabBarInactiveTintColor: 'gray',
        })}
        >
            <PlayerTabs.Screen name="Table" component={PlayerTab1} initialParams={{ code }} />
            <PlayerTabs.Screen name="Rankings" component={PlayerTab2} initialParams={{ code }} />
            <PlayerTabs.Screen name="Tab3" component={PlayerTab3} initialParams={{ code }} />
        </PlayerTabs.Navigator>
    );
}

export default PlayerTabNavigator
