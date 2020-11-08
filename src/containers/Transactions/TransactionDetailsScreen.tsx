/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {commonStyles} from '../../styles';
import {Transaction} from '../../core/transaction';
import moment from 'moment';

export interface TransactionDetailsViewProps {
  data: Transaction;
}

export function TransactionDetailsView({
  data,
}: TransactionDetailsViewProps): React.ReactElement {
  return (
    <SafeAreaView style={commonStyles.safeAreaContainer}>
      <View
        style={{
          alignItems: 'center',
          paddingTop: 20,
          width: '100%',
        }}>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            borderBottomColor: 'grey',
            borderBottomWidth: 1,
            paddingBottom: 15,
          }}>
          <View
            style={{
              alignItems: 'center',
              width: '80%',
              alignContent: 'center',
            }}>
            <Text
              style={{textAlign: 'center', marginTop: 5, fontWeight: 'bold'}}>
              {data.id}
            </Text>
          </View>
        </View>
        <View style={styles.infoblock}>
          <View style={styles.textBlock}>
            <Text>Time</Text>
            <Text style={{textAlign: 'center', marginTop: 5}}>
              {moment(data.time * 1000).format('DD MMMM, YYYY HH:mm') || ''}
            </Text>
          </View>
        </View>
        <View style={styles.infoblock}>
          <View style={styles.textBlock}>
            <Text>Amount</Text>
            <Text style={{textAlign: 'center', marginTop: 5}}>
              {data.amount}
            </Text>
          </View>
        </View>
        <View style={styles.infoblock}>
          <View style={styles.textBlock}>
            <Text>Confirmations</Text>
            <Text style={{textAlign: 'center', marginTop: 5}}>
              {data.confirmations}
            </Text>
          </View>
        </View>
        <View style={styles.infoblock}>
          <View
            style={{
              alignItems: 'center',
              width: '80%',
              alignContent: 'center',
            }}>
            <Text style={{textAlign: 'left', marginTop: 5}}>{data.hex}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  infoblock: {
    backgroundColor: '#FAFAFA',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
  },
  textBlock: {
    alignItems: 'center',
    width: '80%',
    alignContent: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
