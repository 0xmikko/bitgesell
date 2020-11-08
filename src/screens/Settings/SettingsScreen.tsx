/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {Image, SafeAreaView, StyleSheet, View} from 'react-native';
import {Text, ListItem, Icon} from 'react-native-elements';
import {useNavigation} from '@react-navigation/native';
import actions from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {walletSelector} from '../../store/wallet';

export function SettingsScreen() {
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

  console.log(walletData.address)

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image
          source={require('../../logo.png')}
          style={{
            height: 220,
            resizeMode: 'contain',
            marginBottom: 28,
            marginTop: -40,
          }}
        />
        <Text h2 style={{margin: 10}}>
          Bitgesell wallet
        </Text>
        <Text>ver. 0.0.1</Text>
        <Text>{walletData.address}</Text>
      </View>
      <View>
        {list.map((item, i) => (
          <ListItem key={i} onPress={item.action} bottomDivider>
            <Icon name={item.icon} />
            <ListItem.Content>
              <ListItem.Title>{item.title}</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        ))}
      </View>
      <View style={{marginTop: 30}}>
        <ListItem
          key={'clear'}
          onPress={() => dispatch(actions.wallet.clearMnemonic())}
          bottomDivider>
          <Icon name={'exit-to-app'} size={20} color={'red'} />
          <ListItem.Content>
            <ListItem.Title
              style={{
                color: 'red',
              }}>
              Logout
            </ListItem.Title>
          </ListItem.Content>
          <ListItem.Chevron />
        </ListItem>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    alignItems: 'center',
    marginBottom: 25,
  },
  level: {
    fontSize: 20,
  },
});
