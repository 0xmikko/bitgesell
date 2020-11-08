/*
 * Copyright (c) 2020. Mikael Lazarev
 */
import {TRANSACTION_PREFIX} from './index';
import {ThunkAction} from 'redux-thunk';
import {RootState} from '../index';
import {Transaction} from '../../core/transaction';
import {DETAIL_SUCCESS, LIST_SUCCESS, updateStatus} from 'redux-data-connect';
import {Action} from 'redux';
import {BglNode} from '../../helpers/bglNode';

export function getTransactionsList(
  opHash: string,
): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch, getState) => {
    const {address} = getState().wallet;
    if (address === undefined) {
      dispatch(updateStatus(opHash, 'STATUS.FAILURE', 'NoAddress'));
      return;
    }
    try {
      const {address} = getState().wallet;
      if (address === undefined) throw new Error('No publick key was found');
      const utxo = await BglNode.getUTXO(address);
      const balance = utxo.total_amount;
    } catch (e) {
      console.log(e);
    }
    //
    // const txs: Array<Transaction> = [];
    //
    // for (let us of utxo.unspents) {
    //   try {
    //     console.log("Getting for", us.txid)
    //     const txData = await BglNode.getTx(us.txid);
    //     txs.push(txData);
    //   } catch (e)
    //   {
    //     console.log(e)
    //   }
    // }
    //
    // console.log('TXS', txs);

    const transactionList: Transaction[] = [
      {
        id: '1ffeoorioeo',
        amount: 0.544,
        confirmations: 5,
        type: 'RECEIVE',
      },
      {
        id: '1ffe2343434rioeo',
        amount: 0.24,
        confirmations: 15,
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

export function getTransactionDetails(
  txId: string,
  opHash: string,
): ThunkAction<void, RootState, unknown, Action<string>> {
  return async (dispatch, getState) => {
    try {
      const txData = await BglNode.getTx(txId);
      txData.id = txId;
      dispatch({
        type: TRANSACTION_PREFIX + DETAIL_SUCCESS,
        payload: txData,
      });
      dispatch(updateStatus(opHash, 'STATUS.SUCCESS'));
    } catch (e) {
      dispatch(updateStatus(opHash, 'STATUS.FAILURE', e));
    }
  };
}
