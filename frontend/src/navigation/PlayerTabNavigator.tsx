import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlayerTab1 from '../screens/Player/PlayerTab1';
import PlayerTab2 from '../screens/Player/PlayerTab2';
import PlayerTab3 from '../screens/Player/PlayerTab3';
import { PlayerTabParamList, RootStackParamList } from '../types/navigation';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

type Props = NativeStackScreenProps<RootStackParamList, 'Player'>;

const PlayerTabs = createBottomTabNavigator<PlayerTabParamList>();

function PlayerTabNavigator({ route }: Props) {
  const code = route.params.code
  return (
    <PlayerTabs.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        const iconMap = {
          Tab1: 'cards-playing-spade-multiple',
          Tab2: 'cards',
          Tab3: 'poker-chip',
        } as const;

        const iconName = iconMap[route.name as keyof typeof iconMap];
        return <MaterialCommunityIcons name={iconName} size={35} color={color} />
      },
      tabBarActiveTintColor: '#007aff',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: {
        height: 70,
      },
      tabBarIconStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 45,
        width: 45,
      },
    })}
    >
      <PlayerTabs.Screen
        name="Tab1"
        component={PlayerTab1}
        initialParams={{ code }}
        options={{ tabBarLabel: 'Hand' }}
      />
      <PlayerTabs.Screen
        name="Tab2"
        component={PlayerTab2}
        options={{ tabBarLabel: 'Rankings' }}
        initialParams={{ code }}
      />
      <PlayerTabs.Screen
        name="Tab3"
        component={PlayerTab3}
        initialParams={{ code }} />
    </PlayerTabs.Navigator>
  );
}

export default PlayerTabNavigator
