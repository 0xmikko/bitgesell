/*
 * Copyright (c) 2020. Mikael Lazarev
 */

// let Buffer = S.Buffer;
// let defArgs = S.defArgs;
// let getBuffer = S.getBuffer;
// let BF = Buffer.from;
// let BC = Buffer.concat;
// let O = S.OPCODE;

import {getBuffer, isHex} from './hrr';
import {
  MAINNET_PRIVATE_KEY_BYTE_PREFIX,
  MAINNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX,
  TESTNET_PRIVATE_KEY_BYTE_PREFIX,
  TESTNET_PRIVATE_KEY_COMPRESSED_PREFIX,
  TESTNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX,
} from './constants';
import {ECPair} from 'bitcoinjs-lib';
import {hash256} from './hash';
const bs58 = require('bs58');

export class PrivateKey {
  compressed: boolean;
  testnet: boolean;
  key: Buffer;
  hex: string;
  wif: string;

  constructor(
    k: string | undefined,
    compressed: boolean = true,
    testnet: boolean = false,
  ) {
    this.compressed = compressed;
    this.testnet = testnet;
    if (k === undefined) {
      const key = ECPair.makeRandom().privateKey;
      if (key === undefined) throw new Error('Cant create private key');
      this.key = key;
    } else {
      if (typeof k === 'string') {
        if (isHex(k)) {
          this.key = Buffer.from(k, 'hex');
        } else {

          this.compressed = ![
            MAINNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX,
            TESTNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX,
          ].includes(k[0]);
          this.testnet = [
            TESTNET_PRIVATE_KEY_COMPRESSED_PREFIX,
            TESTNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX,
          ].includes(k[0]);
          this.key = PrivateKey.wifToPrivateKey(k);
        }
      } else {
        // @ts-ignore
        if (k.length !== 32) throw new Error('private key invalid');
        this.key = Buffer.from(k);
      }
    }
    this.hex = this.key.toString('hex');
    this.wif = PrivateKey.privateKeyToWif(
      this.key,
      this.compressed,
      this.testnet,
    );
  }

  toString() {
    return `${this.wif}`;
  }

  static privateKeyToWif(
    h: Buffer,
    compressed: boolean = true,
    testnet: boolean = false,
  ): string {
    let hBuffer = h; //getBuffer(h);

    if (hBuffer.length !== 32) throw new Error('invalid byte string');
    const prefix = Buffer.from(
      testnet
        ? TESTNET_PRIVATE_KEY_BYTE_PREFIX
        : MAINNET_PRIVATE_KEY_BYTE_PREFIX,
    );

    if (compressed)
      hBuffer = Buffer.concat([prefix, hBuffer, Buffer.from([1])]);
    else hBuffer = Buffer.concat([prefix, hBuffer]);

    hBuffer = Buffer.concat([hBuffer, hash256(hBuffer).slice(0, 4)]);
    return bs58.encode(hBuffer);
  }

  static wifToPrivateKey(h: string): Buffer {
    const hBuffer = bs58.decode(h);
    if (
      !hash256(hBuffer.slice(0, hBuffer.length - 4))
        .slice(0, 4)
        .equals(hBuffer.slice(hBuffer.length - 4, hBuffer.length))
    )
      throw new Error('invalid byte string');
    return hBuffer.slice(1, 33);
  }
}
