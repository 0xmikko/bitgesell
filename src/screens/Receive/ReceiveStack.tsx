/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {ReceiveScreen} from './ReceiveScreen';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {largeTitleStyles} from '../../styles';
import {Button} from "react-native";

const Stack = createNativeStackNavigator();

export function ReceiveStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ReceiveScreen"
        component={ReceiveScreen}
        options={{
          title: 'Receive',
          headerRight: () => (
            <Button onPress={() => {}} title={'Share'} type="clear" />
          ),
          ...largeTitleStyles,
        }}
      />
    </Stack.Navigator>
  );
}
