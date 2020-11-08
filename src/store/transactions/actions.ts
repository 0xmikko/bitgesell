/*
 * Copyright (c) 2020. Mikael Lazarev
 */
import {TRANSACTION_PREFIX} from './index';
import {ThunkAction} from 'redux-thunk';
import {RootState} from '../index';
import {Transaction} from '../../core/transaction';
import {LIST_SUCCESS, updateStatus} from 'redux-data-connect';
import {Action} from 'redux';
import {BglNode} from '../../helpers/bglNode';

export function getTransactionsList(
  opHash: string,
): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch) => {
    const transactionList: Transaction[] = [
      {
        id: '1ffeoorioeo',
        amount: 0.544,
        confirmation: 5,
        type: 'RECEIVE',
      },
      {
        id: '1ffe2343434rioeo',
        amount: 0.24,
        confirmation: 15,
        type: 'SEND',
      },
    ];

    dispatch({
      type: TRANSACTION_PREFIX + LIST_SUCCESS,
      payload: transactionList,
    });
    dispatch(updateStatus(opHash, 'STATUS.SUCCESS'));
  };
}

export function sendTransaction(
  address: string,
  amount: number,
  opHash: string,
): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch, getState) => {
    try {
      const {privateKey} = getState().wallet;
      await BglNode.transferMoney(
        'KwnSMn88E3TJc4Cfb5RA8YfzyR1agJ2rSydnQcRM3diuBR4swwQg',
        address,
        amount,
      );
      dispatch(updateStatus(opHash, 'STATUS.SUCCESS'));
    } catch (e) {
      dispatch(updateStatus(opHash, 'STATUS.FAILURE', e));
    }
  };
}
