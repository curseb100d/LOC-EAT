import * as React from 'react';
import { View, Text } from 'react-native';

export default function BusinessFoodOrderView({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Food Order" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Food Orders</Text>
        </View>
    );
}