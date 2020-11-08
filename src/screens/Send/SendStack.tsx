/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {SendScreen} from '../Home/SendScreen';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {largeTitleStyles} from '../../styles';

const Stack = createNativeStackNavigator();

export function SendStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SendScreen"
        component={SendScreen}
        options={{
          title: 'Send',

          ...largeTitleStyles,
        }}
      />
    </Stack.Navigator>
  );
}
