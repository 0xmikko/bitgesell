/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, Text, TextInput, View} from 'react-native';
import {commonStyles} from '../../styles';
import {Button} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import actions from '../../store/actions';

export function ImportWalletScreen() {
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');
  const [isValid, setIsValid] = useState(false);

  const onAddressChange = (newValue: string) => {
    setAddress(newValue);
  };

  const onSendPressed = () => {
    if (address.split(' ').length === 12) {
      dispatch(actions.wallet.setMnemonic(address));
    }
    if (address.split(' ').length === 1) {
    }
  };

  return (
    <SafeAreaView style={commonStyles.safeAreaContainer}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 5,
          marginTop: 10,
        }}>
        <Text>Enter your mnemonic to recover your wallet</Text>
      </View>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginTop: 40,
        }}>
        <TextInput
          value={address}
          onChangeText={onAddressChange}
          style={{
            borderColor: 'black',
            borderWidth: 1,
            width: '80%',
            height: 40,
            marginBottom: 15,
            textAlign: 'right',
            fontSize: 20,
          }}
        />
      </View>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginTop: 50,
        }}>
        <View style={styles.button}>
          <Button title={'Send'} onPress={onSendPressed} disabled={!isValid} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '80%',
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
