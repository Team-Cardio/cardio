import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlayerTab1 from '../screens/Player/PlayerTab1';
import PlayerTab2 from '../screens/Player/PlayerTab2';
import PlayerTab3 from '../screens/Player/PlayerTab3';
import { PlayerTabParamList, RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

const PlayerTabs = createBottomTabNavigator<PlayerTabParamList>();

function PlayerTabNavigator({ route }: Props) {
    const code = route.params.code
    return (
        <PlayerTabs.Navigator >
            <PlayerTabs.Screen name="Tab1" component={PlayerTab1} initialParams={{ code }} />
            <PlayerTabs.Screen name="Tab2" component={PlayerTab2} initialParams={{ code }} />
            <PlayerTabs.Screen name="Tab3" component={PlayerTab3} initialParams={{ code }} />
        </PlayerTabs.Navigator>
    );
}

export default PlayerTabNavigator
