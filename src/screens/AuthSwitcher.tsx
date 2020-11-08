/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React, {useEffect} from 'react';
import {WelcomeStack} from './Welcome/WelcomeStack';
import {Router} from './Router';
import {useDispatch, useSelector} from 'react-redux';
import {UnlockScreen} from './UnlockScreen';
import actions from '../store/actions';
import {walletSelector} from '../store/wallet';
import {LoadingView} from 'rn-mobile-components';
import {appSelector} from '../store/app';

export function AuthSwitcher() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.wallet.getMnemonicAtStartup());
  }, []);

  const {state, isUnlocked} = useSelector(walletSelector);

  switch (state) {
    case 'WALLET_STARTUP':
      return <LoadingView />;
    case 'WALLET_NOT_SET':
      return <WelcomeStack />;
    case 'WALLET_SET':
      return isUnlocked ? <Router /> : <UnlockScreen />;
  }
}
