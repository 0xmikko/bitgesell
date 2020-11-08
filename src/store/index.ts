/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {applyMiddleware, compose, createStore} from 'redux';
import {Platform} from 'react-native';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {apiMiddleware} from 'redux-api-middleware';

import reducer from './reducer';

export type RootState = ReturnType<typeof reducer>;

const isDev =
  Platform.OS === 'web' ? process.env.NODE_ENV === 'development' : __DEV__;

const composeEnhancers: typeof compose = isDev
  ? composeWithDevTools({})
  : compose;

export default function configureStore() {
  return createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk, apiMiddleware)),
  );
}
