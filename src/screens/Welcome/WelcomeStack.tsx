/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {SplashScreen} from './SplashScreen';
import {MnemonicSetupScreen} from './MnemonicSetupScreen';
import {largeTitleStyles} from '../../styles';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {VerifyMnemonicScreen} from './VerifyMnemonicScreen';
import {ImportWalletScreen} from './ImportWalletScreen';

const Stack = createNativeStackNavigator();

export type WelcomeStackParamList = {
  VerifyMnemonicScreen: {mnemonic: string};
};

export function WelcomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MnemonicSetupScreen"
        component={MnemonicSetupScreen}
        options={{
          title: 'Recovery Phrase',
          ...largeTitleStyles,
        }}
      />
      <Stack.Screen
        name="VerifyMnemonicScreen"
        component={VerifyMnemonicScreen}
        options={{
          title: 'Recovery Phrase',
          ...largeTitleStyles,
        }}
      />
      <Stack.Screen
        name="ImportWalletScreen"
        component={ImportWalletScreen}
        options={{
          title: 'Import wallet',
          ...largeTitleStyles,
        }}
      />
    </Stack.Navigator>
  );
}
