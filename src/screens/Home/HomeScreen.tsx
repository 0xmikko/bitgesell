/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {SafeAreaView, Text, View} from 'react-native';
import {Button} from 'react-native-elements';
import {BalanceWindow} from '../../containers/BalanceWindow';
import {DataListView} from 'rn-mobile-components/lib/DataListView';
import {Transaction} from '../../core/transaction';
import {useDispatch, useSelector} from 'react-redux';
import actions from '../../store/actions';
import {TransactionsListItem} from '../../containers/Transactions/TransactionsListItem';
import {useNavigation} from '@react-navigation/native';
import {transactionsListSelector} from '../../store/transactions';

export function HomeScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const data: Array<Transaction> = useSelector(transactionsListSelector);

  const getList = (opHash: string) => {
    dispatch(actions.transactions.getTransactionsList(opHash));
  };

  const onSendPressed = () => {
    navigation.navigate('SendScreen');
  };

  const onSelect = (id: string) => {
    navigation.navigate('TransactionDetailsScreen', {id});
  };

  return (
    <SafeAreaView>
      <BalanceWindow />
      <View
        style={{flexDirection: 'row', paddingHorizontal: 20, marginTop: 10}}>
        <View style={{width: '49%', marginRight: '1%'}}>
          <Button title={'Receive'} onPress={() => {}} />
        </View>
        <View style={{width: '49%', marginLeft: '1%'}}>
          <Button title={'Send'} onPress={onSendPressed} />
        </View>
      </View>
      <View style={{paddingHorizontal: 20}}>
        <Text
          style={{
            marginTop: 25,
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 15,
          }}>
          My BGL transactions
        </Text>
      </View>
      <DataListView
        data={data || []}
        getList={getList}
        renderItem={TransactionsListItem}
        onSelect={onSelect}
      />
    </SafeAreaView>
  );
}
