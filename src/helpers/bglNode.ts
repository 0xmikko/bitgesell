/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {UTXO} from '../core/utxo';
import axios from 'axios';
import {getFullUrl} from 'redux-data-connect';
import {NODE_ADDR, RPC_PASSWORD, RPC_USER} from '../config';
import {transformAndValidate} from 'class-transformer-validator';
import {Transaction} from '../bgl/transaction';
import {Transaction as CTx} from '../core/transaction';
import {PrivateKey} from '../bgl/privateKey';
import {PublicKey} from '../bgl/address';

export class BglNode {
  static FEE_PER_VSIZE = 5;
  static BGL_TO_SATOSHI = 100000000;

  static async transferMoney(privateKey: string, to: string, amount: number) {
    amount *= BglNode.BGL_TO_SATOSHI;
    const pKey = PrivateKey.wifToPrivateKey(privateKey);
    const pubKey = new PublicKey(pKey);
    const address = pubKey.address('mainnet');

    const utxo = await BglNode.getUTXO(address);

    const tx = new Transaction({});

    const startValue = Math.ceil(utxo.total_amount * BglNode.BGL_TO_SATOSHI);
    const rest = startValue - amount;

    console.log(startValue, rest, address);
    const unspentQty = utxo.unspents.length;

    const utxoPrivateKey = new PrivateKey(privateKey);

    for (let unspent of utxo.unspents) {
      tx.addInput({
        txId: unspent.txid,
        vOut: unspent.vout,
        privateKey: utxoPrivateKey,
        address: address,
        value: unspent.amount * BglNode.BGL_TO_SATOSHI,
      });
    }

    console.log(tx);
    tx.addOutput(amount, to);
    const txFee = tx.vSize * BglNode.FEE_PER_VSIZE;
    console.log(txFee);
    tx.addOutput(rest - txFee, address);

    // tx.addOutput(rest, to);
    for (let vIn = 0; vIn < unspentQty; vIn++) {
      tx.signInput(vIn, {});
    }

    console.log(tx);
    console.log(tx.txId);
    const rawTX = tx.serialize(true).toString('hex');
    console.log(rawTX);
    BglNode.sendRawTransaction(rawTX)
      .then(() => console.log('Donre'))
      .catch((e) => console.log(e));
  }

  static async getUTXO(address: string): Promise<UTXO> {
    const request = await axios.post(
      NODE_ADDR,
      {
        jsonrpc: '1.0',

        id: new Date(),
        method: 'scantxoutset',
        params: {
          action: 'start',
          scanobjects: [`addr(${address})`],
        },
      },
      {
        auth: {
          username: RPC_USER,
          password: RPC_PASSWORD,
        },
      },
    );
    if (request.status !== 200) {
      throw new Error('Network error');
    }

    const {data} = request;
    return (await transformAndValidate(UTXO, data.result)) as UTXO;
  }

  static async sendRawTransaction(tx: string) {
    const ctx =
      '01000000000101d2c5b3cb853bd65a73ff3b3d4b436eaf917e6b8a8aa82c058efafdd7e8d85cee0100000000ffffffff0118ee052a0100000016001401ba2f12341a4f588773edbf1b947d5eb2f55f4902483045022100bb397c3ecd7b7f1ad075a02c739593a85026821e912874935c1021e2d0b8e6a002203e3e4f22cb67d1a26e630fe31a82be8f561ff9a6d4d2d14f0cab7a994d4cea46012103ef64396f84e570e88dfff2addde184efa378511d4e946988498d050b2e937f9b00000000';
    if (ctx !== tx) {
      console.log('FIIOPL', ctx.length, tx.length);
    }

    const request = await axios.post(
      NODE_ADDR,
      {
        jsonrpc: '1.0',

        id: 'curltest',
        method: 'sendrawtransaction',
        params: [tx],
      },
      {
        auth: {
          username: RPC_USER,
          password: RPC_PASSWORD,
        },
      },
    );
    if (request.status !== 200) {
      throw new Error('Network error');
    }
  }

  static async getTx(txId: string): Promise<CTx> {
    const request = await axios.post(
      NODE_ADDR,
      {
        jsonrpc: '1.0',

        id: 'curltest',
        method: 'gettransaction',
        params: [txId],
      },
      {
        auth: {
          username: RPC_USER,
          password: RPC_PASSWORD,
        },
      },
    );
    if (request.status !== 200) {
      throw new Error('Network error');
    }

    const {data} = request;
    return (await transformAndValidate(CTx, data.result)) as CTx;
  }
}
