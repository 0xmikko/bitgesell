/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {randomBytes} from 'react-native-randombytes';
import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {commonStyles} from '../../styles';
import {entropyToMnemonic, generateMnemonic} from 'bip39';
import {MnemonicWordBlock} from '../../components/MnemonicWord';
import Clipboard from '@react-native-community/clipboard';

export function MnemonicSetupScreen() {
  const navigation = useNavigation();
  const [mnemonic, setMnemonic] = useState('');

  const getRandom = (count) =>
    new Promise((resolve, reject) => {
      return randomBytes(count, (err, bytes) => {
        if (err) reject(err);
        else resolve(bytes);
      });
    });

  useEffect(() => {
    getRandom(16).then((entropy) => {
      setMnemonic(entropyToMnemonic(entropy));
    });
  }, []);

  // const mnemonic = generateMnemonic();
  const mnemonicArray = mnemonic.split(' ');

  const mnemonicRendered = [];

  for (let i = 0; i < 6; i++) {
    mnemonicRendered.push(
      <MnemonicWordBlock
        key={i}
        numLeft={i + 1}
        numRight={i + 7}
        wordLeft={mnemonicArray[i]}
        wordRight={mnemonicArray[i + 6]}
      />,
    );
  }

  const onNext = () => {
    navigation.navigate('VerifyMnemonicScreen', {mnemonic});
  };

  return (
    <SafeAreaView style={commonStyles.safeAreaContainer}>
      <View
        style={{
          width: '100%',
          paddingHorizontal: 20,
        }}>
        <Text style={{color: 'black', marginVertical: 15}}>
          For your security, Bitgesell wallet does not store your passords or
          keep them on file. Your 12 word Back Up Phrase below will give you
          Wallet access at anytime. It's best write these down on paper and
          store somewhere safe & secure.
        </Text>
        <View style={{backgroundColor: '#e9eaeb', borderRadius: 15}}>
          {mnemonicRendered}
        </View>
        <Button
          title="Copy to clipboard"
          onPress={() => Clipboard.setString(mnemonic)}
          type="outline"
          buttonStyle={{borderColor: '#000'}}
          titleStyle={{color: '#000'}}
          style={{marginTop: 15}}
        />
        <Button
          title="Next"
          onPress={onNext}
          buttonStyle={{borderColor: '#000'}}
          titleStyle={{color: '#000'}}
          style={{marginTop: 10}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '70%',
    paddingTop: 50,
    borderColor: '#ffeb83',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
