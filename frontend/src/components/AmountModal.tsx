import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';

type NumberInputModalProps = {
    isVisible: boolean;
    onClose?: () => void;
    onValueChange?: (value: string) => void;
    onConfirm?: (amount: number) => void;
}

const NumberInputModal = ({
    isVisible,
    onClose,
    onValueChange,
    onConfirm = () => { },
}: NumberInputModalProps) => {
    const [number, setNumber] = useState<string>('');

    const handleChange = (text: string) => {
        setNumber(text);
        onValueChange?.(text); // Optional callback
    };

    return (
        <Modal
            visible={isVisible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>Wprowadź liczbę:</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="number-pad"
                        value={number}
                        onChangeText={handleChange}
                    />
                    <View style={{ flexDirection: "row", gap: 20 }}>
                        <TouchableOpacity onPress={onClose} style={styles.button}>
                            <Text style={styles.buttonText}>Zamknij</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            onConfirm(Number(number));
                            onClose?.();
                        }
                        } style={styles.button}>
                            <Text style={styles.buttonText}>Bet</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal >
    );
};

export default NumberInputModal;

const styles = StyleSheet.create({
    modalBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgb(255, 255, 255, 0)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContainer: {
        width: 300,
        backgroundColor: '#fff',
        padding: 25,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },

    title: {
        fontSize: 18,
        marginBottom: 15,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    button: {
        height: 30,
        width: 100,
        borderRadius: 10,
        borderColor: '#222',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#555',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
