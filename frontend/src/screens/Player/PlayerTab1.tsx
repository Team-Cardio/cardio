import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

import RankingsViewer from '@/src/components/RankingsViewer';

export default function PlayerTab1() {
    return (
        <View style={styles.container}>
          <ImageBackground
            source={require('@/assets/images/photo2.jpg')}
            resizeMode="cover"
            style={styles.background}
          >
            <RankingsViewer/>
          </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'flex-start',
      alignItems: "center",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
