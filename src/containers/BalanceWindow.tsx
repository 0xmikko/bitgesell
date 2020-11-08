/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {walletSelector} from '../store/wallet';
import {View} from 'react-native';
import {Text} from 'react-native-elements';

export function BalanceWindow(): React.ReactElement {
  const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(actions.wallet.getBalance());
  // }, []);

  const {balance} = useSelector(walletSelector);

  return (
    <View style={{marginHorizontal: 20}}>
      <Text
        style={{
          fontSize: 54,
          color: 'black',
          fontWeight: 'bold',
          textAlign: 'center',
        }}>
        {balance}
      </Text>
      <Text style={{fontSize: 24, color: 'grey', textAlign: 'center'}}>
        {`$${(balance * 50).toFixed(2)}`}
      </Text>
    </View>
  );
}
