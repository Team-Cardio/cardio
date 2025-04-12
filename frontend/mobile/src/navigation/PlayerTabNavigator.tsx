import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlayerTab1 from '../screens/Player/PlayerTab1';
import PlayerTab2 from '../screens/Player/PlayerTab2';
import PlayerTab3 from '../screens/Player/PlayerTab3';
import { PlayerTabParamList } from '../types/navigation';


const PlayerTabs = createBottomTabNavigator<PlayerTabParamList>();

function PlayerTabNavigator() {
    return (
        <PlayerTabs.Navigator >
            <PlayerTabs.Screen name="Tab1" component={PlayerTab1} />
            <PlayerTabs.Screen name="Tab2" component={PlayerTab2} />
            <PlayerTabs.Screen name="Tab3" component={PlayerTab3} />
        </PlayerTabs.Navigator>
    );
}

export default PlayerTabNavigator