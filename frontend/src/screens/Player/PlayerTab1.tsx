import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import RankingsViewer from '@/src/components/RankingsViewer';
import Background from '@/src/components/Background';

export default function PlayerTab1() {
    return (
        <Background source={require('@/assets/images/photo2.jpg')}>
            <View style={styles.container}>
                <RankingsViewer/>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
