/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from 'react-native-elements';
import {SettingsStack} from './Settings/SettingsStack';
import {ReceiveStack} from './Receive/ReceiveStack';
import {HomeStack} from './Home/HomeStack';
import {SendStack} from './Send/SendStack';

const Tab = createBottomTabNavigator();

const tabIcons: Record<string, string> = {
  Home: 'ios-home',
  Receive: 'ios-qr-code',
  Send: 'ios-send',
  Settings: 'ios-settings',
};

export const Router: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          const iconName = tabIcons[route.name] || '';

          // You can return any component that you like here!
          return (
            <Icon name={iconName} size={size} color={color} type={'ionicon'} />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: '#0176f4',
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Receive" component={ReceiveStack} />
      <Tab.Screen name="Send" component={SendStack} />
      <Tab.Screen name="Settings" component={SettingsStack} />
    </Tab.Navigator>
  );
};
