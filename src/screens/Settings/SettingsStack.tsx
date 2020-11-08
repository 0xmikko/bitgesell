/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {SettingsScreen} from './SettingsScreen';
import {Button} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {largeTitleStyles} from '../../styles';

const Stack = createNativeStackNavigator();

export function SettingsStack() {
  const dispatch = useDispatch();
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: 'Settings',
          ...largeTitleStyles,
        }}
      />
    </Stack.Navigator>
  );
}
