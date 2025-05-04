import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import RankingsViewer from '@/src/components/RankingsViewer';

export default function PlayerTab1() {
    return (
        <View style={styles.container}>
            <RankingsViewer/>
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
