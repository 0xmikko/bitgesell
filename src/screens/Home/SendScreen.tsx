/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React, {useEffect, useState} from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {commonStyles} from '../../styles';
import {Button} from 'react-native-elements';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../../store/actions';
import {operationSelector} from 'redux-data-connect';
import {LoadingView} from 'rn-mobile-components';
import {useNavigation} from '@react-navigation/native';

export function SendScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [opHash, setOpHash] = useState('0');
  const [amount, setAmount] = useState(0);
  const [address, setAddress] = useState('');
  const [isValid, setIsValid] = useState(false);

  const operation = useSelector(operationSelector(opHash));

  useEffect(() => {
    if (opHash !== '0') {
      switch (operation?.status) {
        case 'STATUS.SUCCESS':
          navigation.navigate('HomeScreen');
          break;
        case 'STATUS.FAILURE':
          Alert.alert(
            'Error',
            operation.error || 'Network error',
            [
              {
                text: 'OK',
                onPress: () => setOpHash('0'),
              },
            ],
            {cancelable: false},
          );
      }
    }
  }, [operation?.status]);

  const checkValid = (newAmount: number, newAddress: string) => {
    console.log(newAddress);
    console.log(newAmount);

    setIsValid(newAmount > 0 && newAddress.length > 0);
  };

  const onAddressChange = (newValue: string) => {
    checkValid(amount, newValue);
    setAddress(newValue);
  };

  const onAmountChange = (newValue: string) => {
    const newValueNum = parseFloat(newValue === '' ? '0' : newValue);
    checkValid(newValueNum, address);
    setAmount(newValueNum);
  };

  const onSendPressed = () => {
    const opHash = Date.now().toString();
    dispatch(actions.transactions.sendTransaction(address, amount, opHash));
    setOpHash(opHash);
  };

  if (opHash !== '0' && operation?.status === 'STATUS.LOADING') {
    return <LoadingView />;
  }

  return (
    <SafeAreaView style={commonStyles.safeAreaContainer}>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          paddingHorizontal: 5,
          marginTop: 10,
        }}>
        <Text>
          Enter the following words from your Backup Phrase to complete the
          backup process
        </Text>
      </View>
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginTop: 40,
        }}>
        <Text style={{fontSize: 16, fontWeight: 'bold', marginBottom: 5}}>
          To address:
        </Text>
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
        <Text
          style={{
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 5,
            marginTop: 25,
          }}>
          Amount:
        </Text>
        <TextInput
          value={amount.toString()}
          onChangeText={onAmountChange}
          keyboardType={'numeric'}
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
