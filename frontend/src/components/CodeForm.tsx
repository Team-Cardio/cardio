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
            <Text style={styles.text}>{title}</Text>
            <Text style={styles.text}>Enter room code</Text>
            <View style={styles.inputContainer}>
                <TextInput value={code} onChangeText={setCode} style={styles.input} autoCapitalize="none" placeholder="Enter code" />
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
    text: {
        fontSize: 24,
    },
    inputContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        minWidth: 200,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 12,
        marginBottom: 16,
        backgroundColor: 'white',
        fontSize: 16,
    },

});
