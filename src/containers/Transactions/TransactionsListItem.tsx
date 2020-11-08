/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text, Avatar} from 'react-native-elements';
import {Transaction} from '../../core/transaction';
import redArrow from '../../assets/red.png';
import greenArrow from '../../assets/green.png';
import moment from 'moment';

export interface TransactionsListItemProps {
  data: Transaction;
  onSelect: (id: string) => void;
}

export function TransactionsListItem({
  data,
  onSelect,
}: TransactionsListItemProps) {
  return (
    <TouchableOpacity onPress={() => onSelect(data.id)} style={{marginTop: -1}}>
      <View style={styles.container}>
        <View>
          <Avatar source={data.type === 'SEND' ? redArrow : greenArrow} />
        </View>
        <View style={styles.textContainer}>
          <View>
            <Text h4>
              {moment(data.time * 1000).format('DD MMMM, YYYY HH:mm') || ''}
            </Text>
            <Text>{data.id}</Text>
          </View>
        </View>
        <View>
          <Text>{data.amount.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 5,
    marginTop: 1,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignContent: 'space-between',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e2e2e2',
  },
  textContainer: {
    paddingLeft: 15,
    paddingRight: 20,
    flex: 1,
    alignContent: 'flex-start',
  },
  tagContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 5,
  },
});
