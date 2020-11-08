/*
 * Copyright (c) 2020. Mikael Lazarev
 */
import {AppAction} from './index';

export const unlockApp: () => AppAction = () => ({
  type: 'APP_UNLOCK_DEVICE',
});
