/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {Image, SafeAreaView, StyleSheet, Text, View} from 'react-native';

import QRCode from 'react-native-qrcode-svg';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {walletSelector} from '../../store/wallet';
import Clipboard from '@react-native-community/clipboard';
import {Button} from 'react-native-elements';

export function ReceiveScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const walletData = useSelector(walletSelector);
  const list = [
    {
      title: 'Backup',
      icon: 'edit',
      action: () => navigation.navigate('ChangeNameScreen'),
    },
  ];

  console.log(walletData.address);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <QRCode value={walletData.address} size={220} />
        <Text style={{marginTop: 30}}>{walletData.address}</Text>
        <View
          style={{
            width: '100%',
            paddingHorizontal: 50,
            marginTop: 30,
          }}>
          <Button
            title="Copy to clipboard"
            onPress={() => Clipboard.setString(walletData.address || '')}
            type="outline"
            buttonStyle={{borderColor: '#000'}}
            titleStyle={{color: '#000'}}
            style={{marginTop: 10}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 55,
    alignItems: 'center',
    marginBottom: 25,
  },
  level: {
    fontSize: 20,
  },
});
