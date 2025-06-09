import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import GoHomeButton from '../components/GoHomeButton';
import { useNavigation } from '@react-navigation/native';


type CodeFormProps = { title: string, navigate: (code: string) => void };


export default function CodeForm({ title, navigate }: CodeFormProps) {
    const [code, setCode] = useState<string>("");

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.text}>{title}</Text>
            </View>
            <View style={styles.inputContainer}>
                <TextInput value={code} onChangeText={setCode} style={styles.input} autoCapitalize="none" placeholder="Enter room code" />
            </View>

            <Button title='confirm' onPress={() => navigate(code)} />

            <View style={{ marginTop: 20 }}>
                <GoHomeButton title='Go back' />
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleContainer: {
      padding: 10,
      borderWidth: 0,
      borderRadius: 10,
      backgroundColor: 'rgba(0, 0, 0, 0.43)',
    },
    text: {
        fontSize: 24,
        color: "#fff",
    },
    inputContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        minWidth: 120,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        backgroundColor: 'rgba(109, 109, 109, 0.72)',
        fontSize: 18,
        color: '#000',
    },

});
