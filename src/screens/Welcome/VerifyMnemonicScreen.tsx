/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React, {useEffect, useState} from 'react';
import {Alert, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {RouteProp, useRoute} from '@react-navigation/native';
import {commonStyles} from '../../styles';
import {WelcomeStackParamList} from './WelcomeStack';
import {numeric} from '../../helpers/constants';
import {MnemonicVerifyField} from '../../components/MnemonicVerifyField';
import {useDispatch} from 'react-redux';
import actions from '../../store/actions';

interface VerifyWords {
  word1: string;
  word2: string;
  word3: string;
}

type CheckMnemonicScreenRouteProps = RouteProp<
  WelcomeStackParamList,
  'VerifyMnemonicScreen'
>;

export function VerifyMnemonicScreen() {
  const dispatch = useDispatch();
  const route = useRoute<CheckMnemonicScreenRouteProps>();
  const {mnemonic} = route.params;
  const mnemonicArray = mnemonic.split(' ');

  const [selected, setSelected] = useState<number[]>([]);
  const [isValid, setIsValid] = useState([false, false, false]);
  const [verifyIsCompleted, setVerifyIsCompleted] = useState(false);

  useEffect(() => {
    const selectedSet = new Set<number>();
    do {
      const newValue = Math.floor(Math.random() * 12);
      selectedSet.add(newValue);
    } while (selectedSet.size < 3);

    const selectedArray = Array.from(selectedSet).sort((a, b) => a - b);
    setSelected(selectedArray);
  }, []);

  const onFieldUpdate = (num: number, isCorrect: boolean) => {
    const newValues = [...isValid];
    newValues[num] = isCorrect;
    const correctQty = newValues.filter((e) => e).length;
    setVerifyIsCompleted(correctQty === 3);
    setIsValid(newValues);
    console.log(newValues);
  };

  const onVerifyCompleted = () => {
    Alert.alert(
      'Great',
      'Please, save your mnemonic in safe place',
      [
        {
          text: 'OK',
          onPress: () => dispatch(actions.wallet.setMnemonic(mnemonic)),
        },
      ],
      {cancelable: false},
    );
  };

  const verifyFieldsRendered = selected.map((num) => (
    <MnemonicVerifyField
      label={`${numeric[num]} word`}
      correctValue={mnemonicArray[num]}
      onUpdate={(isCorrect) => onFieldUpdate(num, isCorrect)}
      key={num}
    />
  ));

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
          marginTop: 50,
        }}>
        {verifyFieldsRendered}
        <View style={styles.button}>
          <Button
            title={'Verify'}
            onPress={onVerifyCompleted}
            disabled={!verifyIsCompleted}
          />
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
