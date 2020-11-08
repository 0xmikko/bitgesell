/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {createDataLoaderReducer} from 'redux-data-connect';
import {TRANSACTION_PREFIX} from './';
import {Transaction} from '../../core/transaction';

export default createDataLoaderReducer<Transaction>(TRANSACTION_PREFIX);
