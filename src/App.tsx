/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import 'react-native-gesture-handler';

import * as React from 'react';
import {Provider} from 'react-redux';

import {ThemeProvider} from 'react-native-elements';
import {theme} from './styles';

import {NavigationContainer} from '@react-navigation/native';

import configureStore from './store';
import {AuthSwitcher} from './screens/AuthSwitcher';
import {enableScreens} from 'react-native-screens';
import {privateToPublicKey, PublicKey} from './bgl/address';
import {Transaction} from './bgl/transaction';
import {PrivateKey} from './bgl/privateKey';
import {BglNode} from './helpers/bglNode';
import {mnemonicToSeed} from 'bip39';
import {bip32, networks} from 'bitcoinjs-lib';

const bs58 = require('bs58');

enableScreens();
const store = configureStore();

const App = () => {
  // BglNode.transferMoney(
  //   'KwnSMn88E3TJc4Cfb5RA8YfzyR1agJ2rSydnQcRM3diuBR4swwQg',
  //
  //   'bgl1qqxaz7y35rf843pmnakl3h9rat6e02h6f80wtm0',
  //     1000,
  // );



  // const alice = bs58.decode(
  //   'KwnSMn88E3TJc4Cfb5RA8YfzyR1agJ2rSydnQcRM3diuBR4swwQg',
  // );
  //
  // console.log('PRIVE', privateToPublicKey(alice.slice(1, 33)).toString('hex'));

  // const privKey = alice.slice(1, 33);
  // console.log("PKEY", privKey)
  // console.log(bs58.encode(privKey))
  // console.log(privKey)
  // console.log(PrivateKey.privateKeyToWif(privKey, true, false))
  //
  // console.log(alice);
  // const pubkey = new PublicKey(alice);
  // console.log(pubkey.publicKey?.toString('hex'));
  //
  // const address = pubkey.address('mainnet');
  // console.log('ADDR', address);аа

  // console.log("ADDR=>HASH", pubkey.addressToScript(address).toString('hex'))
  //
  // const tx = new TransactionBuilder();
  // tx.addInput(
  //   'ee5cd8e8d7fdfa8e052ca88a8a6b7e91af6e434b3d3bff735ad63b85cbb3c5d2',
  //   1,
  // );
  // tx.setLockTime(0);
  // tx.addOutput(pubkey.addressToScript(address), 0.01)
  // const txb = tx.build();
  // console.log(txb.toHex());
  //
  // BglNode.getUTXO("bgl1qqxaz7y35rf843pmnakl3h9rat6e02h6f80wtm0").then(console.log)

  // const privateKey = Buffer.from('KwnSMn88E3TJc4Cfb5RA8YfzyR1agJ2rSydnQcRM3diuBR4swwQg', 'base')

  // const alice1 = createPayment('p2pkh');
  // const alice2 = createPayment('p2pkh');
  //
  // // give Alice 2 unspent outputs
  // const inputData1 = await getInputData(
  //     5e4,
  //     alice1.payment,
  //     false,
  //     'noredeem',
  // );
  // const inputData2 = await getInputData(
  //     7e4,
  //     alice2.payment,
  //     false,
  //     'noredeem',
  // );
  //
  // const { address } = payments.p2pkh({ pubkey: alice.publicKey });

  // var key = wif.encode(128, alice.privateKey, true)

  // console.log(address);
  //
  // const psbt = new Psbt();
  // psbt.setVersion(2); // These are defaults. This line is not needed.
  // psbt.setLocktime(0); // These are defaults. This line is not needed.
  // psbt.addInput({
  //   // if hash is string, txid, if hash is Buffer, is reversed compared to txid
  //   hash: 'fff30a59f89acc91a1d8e21f075d1b571d812336a71b086cd92b461c6214b845',
  //   index: 0,
  //   sequence: 0xffffffff, // These are defaults. This line is not needed.
  //   witnessUtxo: {
  //     script: Buffer.from(
  //       '5Kt5YTr2TszaKBkGP4Ag8BR33PALfvqhnC',
  //       'hex',
  //     ),
  //     value: 90000,
  //   },
  // })
  //
  // psbt.addOutput({
  //   address: '16aMrZtSd6oxY1UsLzd8zdpoLKkFJJwzKa',
  //   value: 80000,
  // });
  // psbt.signInput(0, alice);
  // psbt.validateSignaturesOfInput(0);
  // psbt.finalizeAllInputs();
  //     console.log(psbt.extractTransaction().toHex())

  return (
    // <Text>Hello</Text>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
          <AuthSwitcher />
        </NavigationContainer>
      </ThemeProvider>
    </Provider>
  );
};

export default App;
