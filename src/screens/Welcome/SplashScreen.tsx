/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import {commonStyles} from '../../styles';

export function SplashScreen() {
  const navigation = useNavigation();
  return (
    <View
      style={{
        ...commonStyles.safeAreaContainerCentered,
        backgroundColor: '#0b1535',
        width: '100%',
      }}>
      {/*<ImageBackground source={require('../../assets/background.jpg')} style={styles.image} >*/}
      <Image
        source={require('../../logo.png')}
        style={{
          height: 220,
          resizeMode: 'contain',
          marginBottom: 0,
        }}
      />
      <Text h1>Bitgesell Wallet</Text>
      <Text
        style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: 'white',
          marginTop: 5,
          marginBottom: 30,
        }}>
        Modern crypto wallet
      </Text>
      <View style={styles.button}>
        <Button
          title="Setup new wallet"
          onPress={() => navigation.navigate('MnemonicSetupScreen')}
          buttonStyle={{borderColor: '#FFF'}}
          titleStyle={{color: '#FFF'}}
        />
      </View>

      <View style={styles.button}>
        <Button
          title="Import wallet"
          onPress={() => navigation.navigate('ImportWalletScreen')}
          type="outline"
          buttonStyle={{borderColor: '#FFF'}}
          titleStyle={{color: '#FFF'}}
        />
      </View>
      {/*</ImageBackground>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '70%',
    paddingTop: 20,
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
