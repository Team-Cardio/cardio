import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GoHomeButton from '../../components/GoHomeButton'


export default function PlayerTab1() {
    return (
        <View style={styles.container}>
            <Text>Player Tab 1</Text>
            <GoHomeButton />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
