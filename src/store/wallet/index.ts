/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {RootState} from '../index';

export type WalletAction =
  | {
      type: 'UNLOCK_WALLET';
    }
  | {
      type: 'LOCK_WALLET';
    }
  | {
      type: 'MNEMONIC_SUCCESS';
      payload: {
        mnemonic: string | undefined;
        privateKey: string;
        address: string;
      };
    }
  | {
      type: 'MNEMONIC_FAILURE';
    }
  | {
      type: 'MNEMONIC_DELETED';
    }
  | {
      type: 'UPDATE_BALANCE';
      payload: number;
    };

export const walletSelector = (state: RootState) => state.wallet;
