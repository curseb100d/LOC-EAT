import * as React from 'react';
import { View, Text } from 'react-native';

export default function StudentCartView({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Cart" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Cart Screen</Text>
        </View>
    );
}