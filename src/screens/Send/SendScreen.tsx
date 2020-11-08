/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {commonStyles} from '../../styles';
import {Button} from 'react-native-elements';

export function SendScreen() {
  const onSendPressed = () => {
    console.log('SEND');
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
        <View style={styles.button}>
          <Button
            title={'Verify'}
            onPress={onSendPressed}
            // disabled={!verifyIsCompleted}
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
