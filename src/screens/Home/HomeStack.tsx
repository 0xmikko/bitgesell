/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {HomeScreen} from './HomeScreen';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {largeTitleStyles} from '../../styles';
import {TransactionDetailsScreen} from './TransactionDetailsScreen';
import {SendScreen} from './SendScreen';

const Stack = createNativeStackNavigator();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: 'Bitgesell',
          ...largeTitleStyles,
        }}
      />
      <Stack.Screen
        name="TransactionDetailsScreen"
        component={TransactionDetailsScreen}
        options={{
          title: 'Transaction',
          ...largeTitleStyles,
        }}
      />
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
