import * as React from 'react';
import { View, Text } from 'react-native';

export default function BusinessProfileView({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Business Profile" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Business Profile</Text>
        </View>
    );
}