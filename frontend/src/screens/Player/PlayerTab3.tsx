import GoHomeButton from '@/src/components/GoHomeButton';
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function PlayerTab3() {
    return (
        <View style={styles.container}>
          <ImageBackground
            source={require('@/assets/images/photo5.jpg')}
            resizeMode="cover"
            style={styles.background}
          >
            <GoHomeButton/>
          </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
