/*
 * Copyright (c) 2020. Mikael Lazarev
 */
import React from 'react';
import {Transaction} from '../../core/transaction';
import {SafeAreaView, Text, View} from 'react-native';
import {commonStyles} from '../../styles';
import {RouteProp, useRoute} from '@react-navigation/native';
import {WelcomeStackParamList} from '../Welcome/WelcomeStack';
import {HomeStackParamList} from './HomeStack';
import {DataListItem} from '../../components/DataListItem';
import actions from '../../store/actions';
import {useDispatch, useSelector} from 'react-redux';
import {DataDetailsView} from 'rn-mobile-components/lib/DataDetailsView';
import {transactionDetailsSelector} from '../../store/transactions';
import {TransactionDetailsView} from "../../containers/Transactions/TransactionDetailsScreen";

export interface TransactionDetailsScreenProps {
  data: Transaction;
}

type TransactionDetailsScreenRouterProps = RouteProp<
  HomeStackParamList,
  'TransactionDetailsScreen'
>;

export function TransactionDetailsScreen(): React.ReactElement {
  const dispatch = useDispatch();
  const route = useRoute<TransactionDetailsScreenRouterProps>();
  const {id} = route.params;

  const getDetails = (opHash: string) => {
    dispatch(actions.transactions.getTransactionDetails(id, opHash));
  };

  const data = useSelector(transactionDetailsSelector(id));
  console.log(id, data);

  return (
    <DataDetailsView
      data={data}
      getDetails={getDetails}
      renderItem={TransactionDetailsView}
    />
  );
}
