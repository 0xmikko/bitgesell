/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {WalletAction} from './index';
import {Wallet} from '../../core/wallet';

export interface WalletState extends Wallet {}

const initialState: WalletState = {
  mnemonic: undefined,
  privateKey: undefined,
  state: 'WALLET_STARTUP',
  isUnlocked: false,
  balance: 0,
};

export default function createReducer(
  state: WalletState = initialState,
  action: WalletAction,
): WalletState {
  switch (action.type) {
    case 'LOCK_WALLET':
      return {
        ...state,
        isUnlocked: false,
      };
    case 'UNLOCK_WALLET':
      return {
        ...state,
        isUnlocked: true,
      };
    case 'MNEMONIC_SUCCESS':
      return {
        ...state,
        ...action.payload,
        state: 'WALLET_SET',
      };

    case 'MNEMONIC_FAILURE':
    case 'MNEMONIC_DELETED':
      return {
        ...state,
        mnemonic: undefined,
        state: 'WALLET_NOT_SET',
      };
    case 'UPDATE_BALANCE':
      return {
        ...state,
        balance: action.payload,
      };
  }

  return state;
}
