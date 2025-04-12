import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

import CodeForm from '../components/CodeForm';

type Props = NativeStackScreenProps<RootStackParamList, 'HostJoinCodeScreen'>;

export default function HostJoinCodeScreen({ navigation }: Props) {
    const [code, setCode] = useState<string>("");

    return (
        <CodeForm title='Rejoin as a Host' navigate={(code) => navigation.navigate("Host", { code })} />
    );
}

