import Background from '@/src/components/Background';
import GoHomeButton from '@/src/components/GoHomeButton';
import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function PlayerTab3() {
    return (
        <Background source={require('@/assets/images/photo5.jpg')}>
           <View style={styles.container}>
                <GoHomeButton/>
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
