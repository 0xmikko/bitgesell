/*
 * Copyright (c) 2020. Mikael Lazarev
 */
import {WalletAction} from './index';
import RNSecureKeyStore, {ACCESSIBLE} from 'react-native-secure-key-store';
import {ThunkAction} from 'redux-thunk';
import {RootState} from '../index';
import {updateStatus} from 'redux-data-connect';
import {Action} from 'redux';
import {BglNode} from '../../helpers/bglNode';
import {mnemonicToSeed} from 'bip39';
import {bip32, networks} from 'bitcoinjs-lib';
import {PrivateKey} from '../../bgl/privateKey';
import {PublicKey} from '../../bgl/address';

export function unlock(): ThunkAction<void, RootState, unknown, WalletAction> {
  return async (dispatch) => {
    dispatch({type: 'UNLOCK_WALLET'});
  };
}

export function getBalance(
  opHash: string,
): ThunkAction<void, RootState, unknown, WalletAction | Action<string>> {
  return async (dispatch, getState) => {
    try {
      const {address} = getState().wallet;
      if (address === undefined) throw new Error('No publick key was found');
      const utxo = await BglNode.getUTXO(address);
      const balance = utxo.total_amount;
      dispatch({type: 'UPDATE_BALANCE', payload: balance});
      dispatch(updateStatus(opHash, 'STATUS.SUCCESS'));
    } catch (e) {
      dispatch(updateStatus(opHash, 'STATUS.FAILURE', e.toString()));
    }
  };
}

export function setMnemonic(
  mnemonic: string,
): ThunkAction<void, RootState, unknown, WalletAction> {
  return async (dispatch) => {
    const seed = await mnemonicToSeed(mnemonic);
    const mainNet = networks.bitcoin;
    const hdMaster = bip32.fromSeed(seed, mainNet);
    const key = hdMaster.derivePath('775/0');
    const privateKey = PrivateKey.privateKeyToWif(key.privateKey!);
    const publicKey = new PublicKey(key.privateKey!);
    const address = publicKey.address();

    console.log(PrivateKey.privateKeyToWif(key.privateKey!));
    try {
      await RNSecureKeyStore.set('mnemonic', mnemonic, {
        accessible: ACCESSIBLE.ALWAYS_THIS_DEVICE_ONLY,
      });
      dispatch({
        type: 'UNLOCK_WALLET',
      });
      dispatch({
        type: 'MNEMONIC_SUCCESS',
        payload: {
          mnemonic,
          privateKey,
          address,
        },
      });
    } catch (e) {}
  };
}

export function getMnemonicAtStartup(): ThunkAction<
  void,
  RootState,
  unknown,
  WalletAction
> {
  return async (dispatch) => {
    try {
      const mnemonic = await RNSecureKeyStore.get('mnemonic');

      const seed = await mnemonicToSeed(mnemonic);
      const mainNet = networks.bitcoin;
      const hdMaster = bip32.fromSeed(seed, mainNet);
      const key = hdMaster.derivePath('775/0');
      const privateKey = PrivateKey.privateKeyToWif(key.privateKey!);
      const publicKey = new PublicKey(key.privateKey!);
      const address = publicKey.address();
      dispatch({
        type: 'MNEMONIC_SUCCESS',
        payload: {
          mnemonic,
          privateKey,
          address,
        },
      });
    } catch (e) {
      dispatch({
        type: 'MNEMONIC_FAILURE',
      });
    }
  };
}

export function clearMnemonic(): ThunkAction<
  void,
  RootState,
  unknown,
  WalletAction
> {
  return async (dispatch) => {
    await RNSecureKeyStore.remove('mnemonic');
    dispatch({
      type: 'MNEMONIC_DELETED',
    });
  };
}
