import * as React from 'react';
import { View, Text } from 'react-native';

export default function BusinessDashboardView({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Dashboard" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Dashboard</Text>
        </View>
    );
}