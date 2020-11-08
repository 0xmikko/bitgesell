/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {RootState} from '../index';

export type AppAction =
  | {
      type: 'APP_UNLOCK_DEVICE';
    }
  | {
      type: 'APP_LOCK_DEVICE';
    }
  | {
      type: 'CHANGE_LOCK_PROP';
      payload: boolean;
    };

export const appSelector = (state: RootState) => state.app;
