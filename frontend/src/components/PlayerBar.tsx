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
    while (filledPlayers.length < maxPlayers) {
        filledPlayers.push({
          playerID: `empty`,
          chips: 0,
          currentBet: 0,
          isActive: false,
          isAllIn: false,
          isFolded: false,
          name: ''
        });
    }

    return (
        <View style={styles.container}>
            {filledPlayers.map((player) => {
                const isCurrentPlayer = curentPlayer === player.playerID
                return (
                    <View key={player.playerID} style={[styles.playerBox]}>
                        <Text style={styles.text}>{player.playerID}</Text>
                        <View style={{ padding: 10 }}>
                            <MoneyAmount moneyAmount={player.chips} highLightStyles={isCurrentPlayer && styles.highlight} />
                        </View>
                        <Text style={styles.text}>Bets: {player.currentBet}</Text>
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
        paddingHorizontal: 20,
        margin: 10,
    },
    highlight: {
        backgroundColor: '#ffe066',
        borderColor: '#000',
        borderWidth: 2,
    },
    playerBox: {
        flex: 1,
        maxWidth: 80,
        height: 80,
        marginHorizontal: 4,
        borderRadius: 8,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: "white",
        width: 120,
        margin: 5,
        fontSize: 20,
    },
});


export default PlayerBar;
