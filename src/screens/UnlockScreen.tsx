/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-elements';
import {commonStyles} from '../styles';
import {useDispatch} from "react-redux";
import actions from "../store/actions";

export function UnlockScreen() {
    const dispatch = useDispatch();
  return (
    <View
      style={{
        ...commonStyles.safeAreaContainerCentered,
        backgroundColor: '#0b1535',
        width: '100%',
      }}>
      {/*<ImageBackground source={require('../../assets/background.jpg')} style={styles.image} >*/}
      <Text h1>UNLOCK SCREEN</Text>
      <View style={styles.button}>
        <Button
          title="UNLOCK"
          onPress={() => dispatch(actions.wallet.unlock())}
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
