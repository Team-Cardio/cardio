import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { type Player } from '../types/RoomData';
import MoneyAmount from "@/src/components/MoneyAmount";

type PlayerBarProps = {
    players?: Player[];
    curentPlayer?: string;
};

const PlayerBar = ({ players = [], curentPlayer }: PlayerBarProps) => {
    const maxPlayers = 5;
    const filledPlayers = [...players];
    
    for (let i = 0; i < maxPlayers-players.length; ++i) {
        filledPlayers.push({
            playerID: `empty_${i}`,
            name: `Waiting...`,
            chips: 0,
            currentBet: 0,
            isActive: false,
            isAllIn: false,
            isFolded: false,
        });
    }

    return (
        <View style={styles.container}>
            {filledPlayers.map((player) => {
                const isCurrentPlayer = curentPlayer === player.playerID;
                const isPlayer = player.name != 'Waiting...';
                  return (
                      <View key={player.playerID} style={[styles.playerBox]}>
                          {isPlayer && <Text style={styles.text}>{player.name}</Text>}
                          {isPlayer && <View style={{ padding: 10 }}>
                              <MoneyAmount moneyAmount={player.chips} highLightStyles={isCurrentPlayer && styles.highlight} />
                          </View>}
                          {isPlayer && <Text style={styles.text}>Bets: {player.currentBet}</Text>}
                      </View>
                  )
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        paddingHorizontal: 40,
        margin: 10,
    },
    highlight: {
        backgroundColor: '#ffe066',
        borderColor: '#ffcc00',
        borderWidth: 2,
    },
    playerBox: {
        flex: 1,
        maxWidth: 100,
        height: 80,
        
        marginHorizontal: 4,
        borderRadius: 8,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: "#aaa",
        margin: 5,
        fontSize: 20,
    },
});


export default PlayerBar;
