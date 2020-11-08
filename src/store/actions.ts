/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import * as app from './app/actions';
import * as operations from 'redux-data-connect/lib/operations/actions';
import * as transactions from './transactions/actions';
import * as wallet from './wallet/actions';

export default {
  app,
  operations,
  transactions,
  wallet,
};
