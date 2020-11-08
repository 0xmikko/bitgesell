/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {App} from '../../core/app';
import {AppAction} from './index';

export interface AppState extends App {}

const initialState: AppState = {
  isLockSetup: false,
  isWalletSet: false,
};

export default function createReducer(
  state: AppState = initialState,
  action: AppAction,
): AppState {
  return state;
}
