/*
 * Copyright (c) 2020. Mikael Lazarev
 */
import React from 'react';
import {Transaction} from '../../core/transaction';
import {SafeAreaView, Text, View} from 'react-native';
import {commonStyles} from '../../styles';

export interface TransactionDetailsScreenProps {
  data: Transaction;
}

export function TransactionDetailsScreen(): React.ReactElement {
  return (
    <SafeAreaView style={commonStyles.safeAreaContainer}>
      <View
        style={{
          alignItems: 'center',
          paddingTop: 20,
          width: '100%',
        }}>
        <Text>TX DETAILS</Text>
      </View>
    </SafeAreaView>
  );
}
