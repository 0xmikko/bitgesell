/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {combineReducers} from 'redux';
import {operationReducer} from 'redux-data-connect';
import app from './app/reducer';
import transactions from './transactions/reducer';
import wallet from './wallet/reducer';

export default combineReducers({
  operations: operationReducer,
  app,
  wallet,
  transactions,
});
