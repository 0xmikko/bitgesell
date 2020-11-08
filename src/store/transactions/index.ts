/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {RootState} from '../index';

export const TRANSACTION_PREFIX = 'TRANSACTION_';

export const transactionsListSelector = (state: RootState) =>
  state.transactions.List.data;
