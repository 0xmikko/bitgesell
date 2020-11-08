/*
 * Copyright (c) 2020. Mikael Lazarev
 */
import {sha256} from './hash';
import {sign, verify} from 'tiny-secp256k1';

import {
  MAX_AMOUNT,
  SIGHASH_ALL,
  SIGHASH_ANYONECANPAY,
  SIGHASH_NONE,
  SIGHASH_SINGLE,
} from './constants';
import {
  intToBytes,
  rh2s,
  s2rh,
  varIntToInt,
  isString,
  isHex,
  getBuffer,
  intToVarInt,
  parseScript,
  hashToAddress,
  addressNetType,
  decodeScript,
} from './hrr';
import BN from 'bn.js';
import {OPCODE} from './opcode';
import {addressToScript, privateToPublicKey} from './address';
import {PrivateKey} from './privateKey';
import {encode} from './signature';

const {Keccak} = require('sha3');
const sha3 = (data: Buffer) => {
  const keccak = new Keccak(256);
  keccak.update(data);
  return keccak.digest();
};
const Buffer = require('buffer').Buffer;

export interface TransactionOpts {
  rawTx?: Buffer | null;
  format?: 'raw' | 'decoded';
  version?: number;
  lockTime?: number;
  testnet?: boolean;
  autoCommit?: boolean;
  keepRawTx?: boolean;
}

export interface vInput {
  txId: any;
  vOut?: number;
  sequence?: number;
  scriptSig?: Buffer | string;
  value?: number | null;
  scriptPubKey?: Buffer | string;
  address?: Buffer | string | null;
  privateKey?: Buffer | PrivateKey | null;
  publicKey?: Buffer | Array<Buffer> | null;
  redeemScript?: Buffer | string | null;
  inputVerify?: boolean | true;
  txInWitness?: Array<any>;
  amount?: any;
  redeemScriptOpcodes?: any;
  scriptSigOpcodes?: any;
  scriptPubKeyAsm?: any;
  addressHash?: any;
  nType?: any;
  scriptPubKeyOpcodes?: any;
  redeemScriptAsm?: any;
  scriptSigAsm?: any;
  sigHashType?: any;
}

export interface vOutput {
  value?: any;
  vOut?: number;
  address?: string;
  amount?: any;
  scriptPubKey?: any;
  nType?: any;
  type?: any;
  data?: any;
  addressHash?: any;
  reqSigs?: any;
  scriptPubKeyOpcodes?: any;
  scriptPubKeyAsm?: any;
}

//

// ARGS(A, {
//     rawTx: null, format: 'decoded', version: 2,
//     lockTime: 0, testnet: false, autoCommit: true, keepRawTx: false
// });

export class Transaction {
  rawTx: any;
  format: 'raw' | 'decoded';
  version: number;
  lockTime: number;
  testnet: boolean;
  autoCommit: boolean;
  keepRawTx: boolean;
  segwit: boolean;

  vIn: Record<number, vInput>;
  vOut: Record<number, vOutput>;
  txId: Buffer | null;
  hash: Buffer | string | null;
  size: number = 0;
  vSize: number = 0;
  bSize: number = 0;
  blockHash: Buffer | null = null;
  confirmations: number | null = null;
  time: number | null = null;
  blockTime: number | null = null;
  blockIndex: number | null = null;
  coinbase: boolean = false;

  fee: number | null = null;
  data: Buffer | null = null;
  amount: number | BN | null = null;
  weight: number;
  flag: any;

  constructor(opts: TransactionOpts) {
    this.autoCommit = opts.autoCommit || true;
    this.format = opts.format || 'decoded';
    this.testnet = opts.testnet || false;
    this.segwit = false; // was false
    this.txId = null;
    this.hash = null;
    this.version = opts.version || 1;
    this.vIn = {};
    this.vOut = {};
    this.rawTx = opts.rawTx || null;

    this.lockTime = opts.lockTime || 0;

    if (this.rawTx === null) return;
    let tx = getBuffer(opts.rawTx);
    this.amount = 0;
    let sw = 0,
      swLen = 0;
    let start = tx.__offset === undefined ? 0 : tx.__offset;
    this.version = tx.readInt(4);
    let n = tx.readVarInt();

    if (n[0] === 0) {
      // segwit format
      sw = 1;
      this.flag = tx.read(1);
      n = tx.readVarInt();
    }
    // inputs
    let ic = varIntToInt(n);
    for (let k = 0; k < ic; k++)
      // @ts-ignore
      this.vIn[k] = {
        txId: tx.read(32),
        vOut: tx.readInt(4),
        scriptSig: tx.read(varIntToInt(tx.readVarInt())),
        sequence: tx.readInt(4),
      };
    // outputs
    let oc = varIntToInt(tx.readVarInt());
    for (let k = 0; k < oc; k++) {
      this.vOut[k] = {};
      this.vOut[k].value = tx.readInt(8);
      this.amount += this.vOut[k].value;
      this.vOut[k].scriptPubKey = tx.read(varIntToInt(tx.readVarInt()));
      let s = parseScript(this.vOut[k].scriptPubKey);
      this.vOut[k].nType = s.nType;
      this.vOut[k].type = s.type;
      // @ts-ignore
      if (this.data === null && s.type === 3) this.data = s.data;
      if (s.addressHash !== undefined) {
        this.vOut[k].addressHash = s.addressHash;
        this.vOut[k].reqSigs = s.reqSigs;
      }
    }

    // witness
    if (sw) {
      sw = tx.__offset - start;
      for (let k = 0; k < ic; k++) {
        this.vIn[k].txInWitness = [];
        let t = varIntToInt(tx.readVarInt());
        for (let q = 0; q < t; q++)
          this.vIn[k].txInWitness?.push(tx.read(varIntToInt(tx.readVarInt())));
      }
      swLen = tx.__offset - start - sw + 2;
    }
    this.lockTime = tx.readInt(4);
    let end = tx.__offset;
    this.rawTx = tx.slice(start, end);
    this.size = end - start;
    this.bSize = end - start - swLen;
    this.weight = this.bSize * 3 + this.size;
    this.vSize = Math.ceil(this.weight / 4);
    this.coinbase = !!(
      ic === 1 &&
      this.vIn[0].txId.equals(Buffer(32)) &&
      this.vIn[0].vOut === 0xffffffff
    );

    if (sw > 0) {
      this.segwit = true;
      this.hash = sha256(this.rawTx);
      this.txId = sha256(
        Buffer.concat([
          this.rawTx.slice(0, 4),
          this.rawTx.slice(6, sw),
          this.rawTx.slice(this.rawTx.length - 4, this.rawTx.length),
        ]),
      );
    } else {
      this.txId = sha256(this.rawTx);
      this.hash = this.txId;
      this.segwit = false;
    }
    if (!opts.keepRawTx) this.rawTx = null;
    if (opts.format === 'decoded') this.decode();
  }

  // change Transaction object representation to "decoded" human readable format
  decode(testnet: boolean = false) {
    this.format = 'decoded';
    if (testnet !== undefined) this.testnet = testnet;
    // @ts-ignore
    if (Buffer.isBuffer(this.txId)) this.txId = rh2s(this.txId);
    if (Buffer.isBuffer(this.hash)) this.hash = rh2s(this.hash);
    if (Buffer.isBuffer(this.flag)) this.flag = rh2s(this.flag);
    // @ts-ignore
    if (Buffer.isBuffer(this.rawTx)) this.rawTx = this.rawTx.hex();
    for (let i in this.vIn) {
      if (Buffer.isBuffer(this.vIn[i].txId))
        this.vIn[i].txId = rh2s(this.vIn[i].txId);
      if (Buffer.isBuffer(this.vIn[i].scriptSig))
        // @ts-ignore
        this.vIn[i].scriptSig = this.vIn[i].scriptSig?.hex();
      if (this.vIn[i].amount instanceof BN)
        this.vIn[i].amount = this.vIn[i].amount.toString(16);
      if (this.vIn[i].txInWitness !== undefined) {
        let t = [];
        // @ts-ignore
        // @ts-ignore
        for (let w of this.vIn[i].txInWitness)
          t.push(Buffer.isBuffer(w) ? w.hex() : w);
        this.vIn[i].txInWitness = t;
      }
      if (Buffer.isBuffer(this.vIn[i].addressHash)) {
        //@ts-ignore
        let w = this.vIn[i].nType < 5 ? null : this.vIn[i].addressHash[0];
        this.vIn[i].addressHash = this.vIn[i].addressHash.hex();
        let sh = [1, 5].includes(this.vIn[i].nType);
        this.vIn[i].address = hashToAddress(
          this.vIn[i].addressHash,
          this.testnet,
          sh,
        );
      }
      if (Buffer.isBuffer(this.vIn[i].scriptPubKey)) {
        // @ts-ignore
        this.vIn[i].scriptPubKey = this.vIn[i].scriptPubKey.hex();
        this.vIn[i].scriptPubKeyOpcodes = decodeScript(
          this.vIn[i].scriptPubKey,
        );
        this.vIn[i].scriptPubKeyAsm = decodeScript(
          this.vIn[i].scriptPubKey,
          true,
        );
      }
      if (Buffer.isBuffer(this.vIn[i].redeemScript)) {
        // @ts-ignore
        this.vIn[i].redeemScript = this.vIn[i].redeemScript.hex();
        this.vIn[i].redeemScriptOpcodes = decodeScript(
          //@ts-ignore
          this.vIn[i].redeemScript,
        );
        this.vIn[i].redeemScriptAsm = decodeScript(
          //@ts-ignore
          this.vIn[i].redeemScript,
          true,
        );
      }
      if (!this.coinbase) {
        if (Buffer.isBuffer(this.vIn[i].scriptSig)) {
          // @ts-ignore
          this.vIn[i].scriptSig = this.vIn[i].scriptSig.hex();
        }

        this.vIn[i].scriptSigOpcodes = decodeScript(this.vIn[i].scriptSig);
        this.vIn[i].scriptSigAsm = decodeScript(this.vIn[i].scriptSig, true);
      }
    }

    for (let i in this.vOut) {
      if (Buffer.isBuffer(this.vOut[i].addressHash)) {
        let w = this.vOut[i].nType < 5 ? null : this.vOut[i].scriptPubKey[0];
        this.vOut[i].addressHash = this.vOut[i].addressHash.hex();
        let sh = [1, 5].includes(this.vOut[i].nType);
        this.vOut[i].address = hashToAddress(this.vOut[i].addressHash, sh);
      }
      if (Buffer.isBuffer(this.vOut[i].scriptPubKey)) {
        this.vOut[i].scriptPubKey = this.vOut[i].scriptPubKey.hex();
        this.vOut[i].scriptPubKeyOpcodes = decodeScript(
          this.vOut[i].scriptPubKey,
        );
        this.vOut[i].scriptPubKeyAsm = decodeScript(
          this.vOut[i].scriptPubKey,
          true,
        );
      }
    }
    // @ts-ignore
    if (Buffer.isBuffer(this.data)) this.data = this.data.toString('hex');
    return this;
  }

  encode() {
    // @ts-ignore
    if (isString(this.txId)) this.txId = s2rh(this.txId);
    if (isString(this.flag)) this.flag = s2rh(this.flag);
    // @ts-ignore
    if (isString(this.hash)) this.hash = s2rh(this.hash);
    // @ts-ignore
    if (isString(this.rawTx)) this.rawTx = Buffer.from(this.hash, 'hex');
    for (let i in this.vIn) {
      if (isString(this.vIn[i].txId)) this.vIn[i].txId = s2rh(this.vIn[i].txId);
      if (isString(this.vIn[i].scriptSig))
        // @ts-ignore
        this.vIn[i].scriptSig = Buffer.from(this.vIn[i].scriptSig, 'hex');
      if (this.vIn[i].txInWitness !== undefined) {
        let t = [];
        // @ts-ignore
        for (let w of this.vIn[i].txInWitness)
          t.push(isString(w) ? Buffer.from(w, 'hex') : w);
        this.vIn[i].txInWitness = t;
      }
      if (isString(this.vIn[i].addressHash))
        // @ts-ignore
        this.vIn[i].addressHash = Buffer.from(this.vIn[i].addressHash, 'hex');
      if (isString(this.vIn[i].scriptPubKey))
        // @ts-ignore
        this.vIn[i].scriptPubKey = Buffer.from(this.vIn[i].scriptPubKey, 'hex');
      if (isString(this.vIn[i].redeemScript))
        // @ts-ignore
        this.vIn[i].redeemScript = Buffer.from(this.vIn[i].redeemScript, 'hex');
      if (isString(this.vIn[i].addressHash))
        // @ts-ignore
        this.vIn[i].addressHash = Buffer.from(this.vIn[i].addressHash, 'hex');
      delete this.vIn[i].scriptSigAsm;
      delete this.vIn[i].scriptSigOpcodes;
      delete this.vIn[i].scriptPubKeyOpcodes;
      delete this.vIn[i].scriptPubKeyAsm;
      delete this.vIn[i].redeemScriptOpcodes;
      delete this.vIn[i].redeemScriptAsm;
      delete this.vIn[i].address;
    }
    for (let i in this.vOut) {
      if (isString(this.vOut[i].scriptPubKey))
        this.vOut[i].scriptPubKey = Buffer.from(
          this.vOut[i].scriptPubKey,
          'hex',
        );
      if (isString(this.vOut[i].addressHash))
        this.vOut[i].addressHash = Buffer.from(this.vOut[i].addressHash, 'hex');
      // @ts-ignore
      delete this.address;
      delete this.vOut[i].scriptPubKeyOpcodes;
      delete this.vOut[i].scriptPubKeyAsm;
    }
    // @ts-ignore
    if (isString(this.data)) this.data = Buffer.from(this.data, 'hex');
    this.format = 'raw';
    return this;
  }

  serialize(segwit: boolean): Buffer {
    // let chunks = [];
    // chunks.push(Buffer.from(intToBytes(this.version, 4)));
    //
    // if (segwit && this.segwit) chunks.push(Buffer.from([0, 1]));
    // chunks.push(Buffer.from(intToVarInt(Object.keys(this.vIn).length)));
    //
    // for (let i in this.vIn) {
    //   if (isString(this.vIn[i].txId)) chunks.push(s2rh(this.vIn[i].txId));
    //   else chunks.push(this.vIn[i].txId);
    //   // @ts-ignore
    //   chunks.push(Buffer.from(intToBytes(this.vIn[i].vOut, 4)));
    //   let s = isString(this.vIn[i].scriptSig)
    //     ? // @ts-ignore
    //       Buffer.from(this.vIn[i].scriptSig, 'hex')
    //     : this.vIn[i].scriptSig;
    //
    //   chunks.push(Buffer.from(intToVarInt(s.length)));
    //   chunks.push(s);
    //   // @ts-ignore
    //   chunks.push(Buffer.from(intToBytes(this.vIn[i].sequence, 4)));
    // }
    // chunks.push(Buffer.from(intToVarInt(Object.keys(this.vOut).length)));
    //
    // for (let i in this.vOut) {
    //   chunks.push(Buffer.from(intToBytes(this.vOut[i].value, 8)));
    //   let s = isString(this.vOut[i].scriptPubKey)
    //     ? Buffer.from(this.vOut[i].scriptPubKey, 'hex')
    //     : this.vOut[i].scriptPubKey;
    //   chunks.push(Buffer.from(intToVarInt(s.length)));
    //   chunks.push(s);
    // }
    // if (segwit && this.segwit) {
    //   for (let i in this.vIn) {
    //     // @ts-ignore
    //     chunks.push(Buffer.from(intToVarInt(this.vIn[i].txInWitness.length)));
    //     // @ts-ignore
    //     for (let w of this.vIn[i]?.txInWitness) {
    //       let s = typeof w === 'string' ? Buffer.from(w, 'hex') : w;
    //       chunks.push(Buffer.from(intToVarInt(s.length)));
    //       chunks.push(s);
    //     }
    //   }
    // }
    //
    // chunks.push(Buffer.from(intToBytes(this.lockTime, 4)));
    // return Buffer.concat(chunks);

    let chunks = [];
    chunks.push(Buffer.from(intToBytes(this.version, 4)));

    if (segwit && this.segwit) chunks.push(Buffer.from([0, 1]));

    chunks.push(Buffer.from(intToVarInt(Object.keys(this.vIn).length)));

    for (let i in this.vIn) {
      if (isString(this.vIn[i].txId)) chunks.push(s2rh(this.vIn[i].txId));
      else chunks.push(this.vIn[i].txId);
      chunks.push(Buffer.from(intToBytes(this.vIn[i].vOut, 4)));
      let s = isString(this.vIn[i].scriptSig)
        ? Buffer.from(this.vIn[i].scriptSig, 'hex')
        : this.vIn[i].scriptSig;

      chunks.push(Buffer.from(intToVarInt(s.length)));
      chunks.push(s);
      chunks.push(Buffer.from(intToBytes(this.vIn[i].sequence, 4)));
    }

    chunks.push(Buffer.from(intToVarInt(Object.keys(this.vOut).length)));

    for (let i in this.vOut) {
      chunks.push(Buffer.from(intToBytes(this.vOut[i].value, 8)));

      let s = isString(this.vOut[i].scriptPubKey)
        ? Buffer.from(this.vOut[i].scriptPubKey, 'hex')
        : this.vOut[i].scriptPubKey;
      chunks.push(Buffer.from(intToVarInt(s.length)));
      chunks.push(s);
    }

    if (segwit && this.segwit) {
      for (let i in this.vIn) {
        chunks.push(Buffer.from(intToVarInt(this.vIn[i].txInWitness.length)));
        console.log('CCOOOLL-1:', Buffer.concat(chunks).toString('hex'));
        for (let w of this.vIn[i].txInWitness) {
          if (isString(w)) {
            chunks.push(Buffer.from(intToVarInt(Math.ceil(w.length / 2))));
            console.log("CCOOOLL-2:", w)
            console.log("CCOOOLL-2:", intToVarInt(Math.ceil(w.length / 2)))
            chunks.push(Buffer.from(w, 'hex'));
          } else {
            chunks.push(Buffer.from(intToVarInt(w.length)));
            chunks.push(w);
          }
          // let s = isString(w) ? Buffer.from(w, 'hex') : w;
          // chunks.push(Buffer.from(intToVarInt(s.length)));

          // chunks.push(s);
          // console.log("CCOOOLL-3:", s.toString('hex'))
        }

        console.log('CCOOOLL-4', Buffer.concat(chunks).toString('hex'));
      }
    }
    chunks.push(Buffer.from(intToBytes(this.lockTime, 4)));
    let out = Buffer.concat(chunks);
    return out;
  }

  json() {
    let r;
    if (this.format === 'raw') {
      this.decode();
      r = JSON.stringify(this);
      this.encode();
    } else r = JSON.stringify(this);
    return r;
  }

  addInput(opts: vInput) {
    const input = {
      txId: opts.txId || null,
      vOut: opts.vOut || 0,
      sequence: opts.sequence || 0xffffffff,
      scriptSig: opts.scriptSig || '',
      txInWitness: opts.txInWitness || null,
      value: opts.value || null,
      scriptPubKey: opts.scriptPubKey || null,
      address: opts.address || null,
      privateKey: opts.privateKey || null,
      redeemScript: opts.redeemScript || null,
      inputVerify: opts.inputVerify || true,
    };
    let witness = [],
      s;
    if (input.txId === null) {
      input.txId = Buffer(32);
      input.vOut = 0xffffffff;
      if (
        (input.sequence !== 0xffffffff || Object.keys(this.vOut).length) &&
        input.inputVerify
      )
        throw new Error('invalid coinbase transaction');
    }
    if (typeof input.txId === 'string')
      if (isHex(input.txId)) input.txId = s2rh(input.txId);
      else throw new Error('txId invalid');

    if (!Buffer.isBuffer(input.txId) || input.txId.length !== 32)
      throw new Error('txId invalid');

    if (input.scriptSig.length === 0) input.scriptSig = Buffer.from([]);

    if (isString(input.scriptSig))
      if (isHex(input.scriptSig))
        // @ts-ignore
        input.scriptSig = Buffer.from(input.scriptSig, 'hex');
      else throw new Error('scriptSig invalid');
    if (
      !Buffer.isBuffer(input.scriptSig) ||
      (input.scriptSig.length > 520 && input.inputVerify)
    )
      throw new Error('scriptSig invalid');

    if (input.vOut < 0 || input.vOut > 0xffffffff)
      throw new Error('vOut invalid');
    if (input.sequence < 0 || input.sequence > 0xffffffff)
      throw new Error('vOut invalid');

    if (input.privateKey !== null && !(input.privateKey instanceof PrivateKey))
      input.privateKey = new PrivateKey(input.privateKey as string);

    if (input.value !== null && (input.value < 0 || input.value > MAX_AMOUNT))
      throw new Error('amount invalid');

    if (input.txInWitness !== null) {
      // @ts-ignore
      let l = 0;
      for (let w of input.txInWitness) {
        if (isString(w))
          witness.push(this.format === 'raw' ? Buffer.from(w, 'hex') : w);
        else witness.push(this.format === 'raw' ? w : Buffer.from(w, 'hex'));
        l += 1 + w.length;
      }
    }

    if (input.txId.equals(Buffer.alloc(32))) {
      if (
        !(
          input.vOut === 0xffffffff &&
          input.sequence === 0xffffffff &&
          input.scriptSig.length <= 100
        )
      )
        if (input.inputVerify) throw new Error('coinbase tx invalid');
      this.coinbase = true;
    }

    if (input.scriptPubKey !== null) {
      if (isString(input.scriptPubKey))
        // @ts-ignore
        input.scriptPubKey = Buffer.from(input.scriptPubKey, 'hex');
      if (!Buffer.isBuffer(input.scriptPubKey))
        throw new Error('scriptPubKey invalid');
    }

    if (input.redeemScript !== null) {
      if (isString(input.redeemScript))
        // @ts-ignore
        input.redeemScript = Buffer.from(input.redeemScript, 'hex');
      if (!Buffer.isBuffer(input.redeemScript))
        throw new Error('scriptPubKey invalid');
    }

    if (input.address !== null) {
      if (isString(input.address)) {
        let net = addressNetType(input.address) === 'mainnet';
        if (!(net !== this.testnet)) throw new Error('address invalid');
        s = addressToScript(input.address);
        // @ts-ignore
      } else if (input.address.address !== undefined)
        // @ts-ignore
        s = addressToScript(input.address.address);
      else throw new Error('address invalid');
      if (input.scriptPubKey !== null) {
        if (!input.scriptPubKey.equals(s))
          throw new Error('address not match script');
      } else input.scriptPubKey = s;
    }

    let k = Object.keys(this.vIn).length;
    // @ts-ignore
    this.vIn[k] = {};
    this.vIn[k].vOut = input.vOut;
    this.vIn[k].sequence = input.sequence;
    if (this.format === 'raw') {
      this.vIn[k].txId = input.txId;
      this.vIn[k].scriptSig = input.scriptSig;
      if (input.scriptPubKey !== null)
        this.vIn[k].scriptPubKey = input.scriptPubKey;
      if (input.redeemScript !== null)
        this.vIn[k].redeemScript = input.redeemScript;
    } else {
      this.vIn[k].txId = rh2s(input.txId);
      this.vIn[k].scriptSig = input.scriptSig.toString('hex');
      this.vIn[k].scriptSigOpcodes = decodeScript(input.scriptSig);
      this.vIn[k].scriptSigAsm = decodeScript(input.scriptSig, true);
      if (input.scriptPubKey !== null) {
        this.vIn[k].scriptPubKey = input.scriptPubKey.toString('hex');
        this.vIn[k].scriptPubKeyOpcodes = decodeScript(input.scriptPubKey);
        this.vIn[k].scriptPubKeyAsm = decodeScript(input.scriptPubKey, true);
      }
      if (input.redeemScript !== null) {
        this.vIn[k].redeemScript = input.redeemScript.toString('hex');
        this.vIn[k].redeemScriptOpcodes = decodeScript(input.redeemScript);
        this.vIn[k].redeemScriptAsm = decodeScript(input.redeemScript, true);
      }
    }

    if (input.txInWitness !== null) {
      this.segwit = true;
      this.vIn[k].txInWitness = witness;
    }
    if (input.value !== null) this.vIn[k].value = input.value;
    // @ts-ignore
    if (input.privateKey !== 0) this.vIn[k].privateKey = input.privateKey;
    if (this.autoCommit) this.commit();
    return this;
  }

  addOutput(
    value: number = 0,
    address: string | Buffer | null = null,
    scriptPubKey: Buffer | null = null,
  ) {
    if (address === null && scriptPubKey === null)
      throw new Error('unable to add output, address or script required');
    if (value < 0 || value > MAX_AMOUNT) throw new Error(' amount value error');
    if (scriptPubKey !== null)
      if (typeof scriptPubKey === 'string')
        scriptPubKey = Buffer.from(scriptPubKey, 'hex');
      else if (address !== null)
        if (address.address !== undefined)
          // @ts-ignore
          address = address.address;
    // @ts-ignore
    if (address !== null) scriptPubKey = addressToScript(address);

    let k = Object.keys(this.vOut).length;
    this.vOut[k] = {};
    this.vOut[k].value = value;

    let s = parseScript(scriptPubKey);
    this.vOut[k].nType = s.nType;
    this.vOut[k].type = s.type;

    if (this.format === 'raw') {
      this.vOut[k].scriptPubKey = scriptPubKey;
      if (this.data === null && s.nType === 3) this.data = s.data;
      if (![3, 4, 7, 8].includes(s.nType)) {
        this.vOut[k].addressHash = s.addressHash;
        this.vOut[k].reqSigs = s.reqSigs;
      }
    } else {
      this.vOut[k].scriptPubKey = scriptPubKey.toString('hex');
      if (this.data === null && s.nType === 3) this.data = s.data.hex();
      if (![3, 4, 7, 8].includes(s.nType)) {
        this.vOut[k].addressHash = s.addressHash;
        this.vOut[k].reqSigs = s.reqSigs;
      }
      this.vOut[k].scriptPubKeyOpcodes = decodeScript(scriptPubKey);
      this.vOut[k].scriptPubKeyAsm = decodeScript(scriptPubKey, true);
      let sh = [1, 5].includes(s.nType);
      // @ts-ignore
      let witnessVersion = s.nType < 5 ? null : scriptPubKey[0];
      console.log('OPPOPOPOPOP', this.vOut[k].addressHash);
      if (this.vOut[k].addressHash !== undefined)
        this.vOut[k].address = address; //hashToAddress(Buffer.from(this.vOut[k].addressHash), sh);
    }
    if (this.autoCommit) this.commit();
    return this;
  }

  commit() {
    if (
      Object.keys(this.vIn).length === 0 ||
      Object.keys(this.vOut).length === 0
    )
      return this;

    if (this.segwit)
      for (let i in this.vIn)
        if (this.vIn[i].txInWitness === undefined) this.vIn[i].txInWitness = [];
    let nonSegwitView = this.serialize(false);
    this.txId = sha256(nonSegwitView);
    this.rawTx = this.serialize(true);
    this.hash = sha256(this.rawTx);
    console.log("'RTX", this.rawTx.toString('hex'));
    this.size = this.rawTx.length;
    this.bSize = nonSegwitView.length;
    this.weight = this.bSize * 3 + this.size;
    this.vSize = Math.ceil(this.weight / 4);

    if (this.format !== 'raw') {
      // @ts-ignore
      this.txId = rh2s(this.txId);
      this.hash = rh2s(this.hash);
      this.rawTx = this.rawTx.toString('hex');
    }
    let inputSum = 0;
    let outputSum = 0;
    for (let i in this.vIn) {
      // @ts-ignore
      if (this.vIn[i].value !== undefined) inputSum += this.vIn[i].value;
      else {
        // @ts-ignore
        inputSum = null;
        break;
      }

      for (let i in this.vOut)
        if (this.vOut[i].value !== undefined) outputSum += this.vOut[i].value;
    }
    this.amount = outputSum;
    if (outputSum && inputSum) this.fee = inputSum - outputSum;
    else this.fee = null;
    return this;
  }

  sigHashSegwit(
    n: number,
    scriptPubKey: Buffer | string | null,
    sigHashType: number = SIGHASH_ALL,
    value: number | BN | null | undefined,
  ): Buffer {
    if (this.vIn[n] === undefined) throw new Error('input not exist');
    let scriptCode;

    console.log('=====KO===1');

    if (scriptPubKey !== null) scriptCode = scriptPubKey;
    else {
      if (this.vIn[n].scriptPubKey === undefined)
        throw new Error('scriptPubKey required');
      scriptCode = this.vIn[n].scriptPubKey;
    }
    scriptCode = getBuffer(scriptCode);

    if (value === null) {
      if (this.vIn[n].value === undefined) throw new Error('value required');
      value = this.vIn[n].value;
    }

    console.log('=====KO===2');

    let hp = [],
      hs = [],
      ho = [],
      outpoint,
      nSequence;

    for (let i in this.vIn) {
      let txId = this.vIn[i].txId;
      if (isString(txId)) txId = s2rh(txId);

      // @ts-ignore
      let vOut = Buffer.from(intToBytes(this.vIn[i].vOut, 4));
      if (!(sigHashType & SIGHASH_ANYONECANPAY)) {
        hp.push(txId);
        hp.push(vOut);
        if (
          (sigHashType & 31) !== SIGHASH_SINGLE &&
          (sigHashType & 31) !== SIGHASH_NONE
        )
          // @ts-ignore
          hs.push(Buffer.from(intToBytes(this.vIn[i].sequence, 4)));
      }
      if (parseInt(i) === n) {
        outpoint = Buffer.concat([txId, vOut]);
        // @ts-ignore
        nSequence = Buffer.from(intToBytes(this.vIn[i].sequence, 4));
      }
      console.log(hp);
    }

    console.log('=====KO===3', hp);
    // https://github.com/wu-emma/bitgesell/blob/cb9f0da214f38691b0a4947fd9f9c4ff9a647f43/src/script/interpreter.cpp#L1186
    let hashPrevouts =
      hp.length > 0 ? sha3(Buffer.concat(hp)) : Buffer.alloc(32, 0);

    console.log('=====KO===HashPrevouts', hashPrevouts.toString('hex'));
    // https://github.com/wu-emma/bitgesell/blob/cb9f0da214f38691b0a4947fd9f9c4ff9a647f43/src/script/interpreter.cpp#L1196
    let hashSequence =
      hs.length > 0 ? sha3(Buffer.concat(hs)) : Buffer.alloc(32, 0);

    console.log('=====KO===HashSequence', hashSequence.toString('hex'));
    // @ts-ignore
    value = Buffer.from(intToBytes(value, 8));

    for (let o in this.vOut) {
      o = parseInt(o);
      let scriptPubKey = getBuffer(this.vOut[o].scriptPubKey);
      if (![SIGHASH_SINGLE, SIGHASH_NONE].includes(sigHashType & 31)) {
        ho.push(Buffer.from(intToBytes(this.vOut[o].value, 8)));
        ho.push(Buffer.from(intToVarInt(scriptPubKey.length)));
        ho.push(scriptPubKey);
      } else if (
        (sigHashType & 31) === SIGHASH_SINGLE &&
        n < Object.keys(this.vOut).length
      ) {
        // @ts-ignore
        if (o === n) {
          ho.push(Buffer.from(intToBytes(this.vOut[o].value, 8)));
          ho.push(Buffer.from(intToVarInt(scriptPubKey.length)));
          ho.push(scriptPubKey);
        }
      }
    }
    // https://github.com/wu-emma/bitgesell/blob/cb9f0da214f38691b0a4947fd9f9c4ff9a647f43/src/script/interpreter.cpp#L1206
    let hashOutputs =
      ho.length > 0 ? sha3(Buffer.concat(ho)) : Buffer.alloc(32, 0);

    console.log('=====KO===HashOutputs', hashOutputs.toString('hex'));
    let pm = Buffer.concat([
      Buffer.from(intToBytes(this.version, 4)),
      hashPrevouts,
      hashSequence,
      outpoint,
      scriptCode,
      value,
      nSequence,
      hashOutputs,
      Buffer.from(intToBytes(this.lockTime, 4)),
      Buffer.from(intToBytes(sigHashType, 4)),
    ]);

    console.log('=====KO===OMMM', pm.toString('hex'));
    // if (preImage) return this.format === 'raw' ? pm.hex() : pm;
    // https://github.com/wu-emma/bitgesell/blob/cb9f0da214f38691b0a4947fd9f9c4ff9a647f43/src/hash.h#L180
    // https://github.com/wu-emma/bitgesell/blob/cb9f0da214f38691b0a4947fd9f9c4ff9a647f43/src/script/interpreter.cpp#L1281
    return sha3(pm);
  }

  signInput(
    n: number,
    opts: {
      privateKey?: Buffer | null;
      scriptPubKey?: Buffer | null;
      redeemScript?: Buffer | null;
      // @ts-ignore
      sigHashType?: number;
      address?: string;
      value?: number;
      witnessVersion?: number;
      p2sh_p2wsh?: boolean;
    },
  ) {
    const input: vInput = {
      privateKey: opts.privateKey || null,
      // @ts-ignore
      scriptPubKey: opts.scriptPubKey || null,
      redeemScript: opts.redeemScript || null,
      // @ts-ignore
      sigHashType: SIGHASH_ALL,
      address: opts.address || null,
      value: opts.value || null,
      witnessVersion: 0,
      p2sh_p2wsh: opts.p2sh_p2wsh || false,
    };

    if (this.vIn[n] === undefined) throw new Error('input not exist');
    // privateKey
    if (input.privateKey === null) {
      if (this.vIn[n].privateKey === undefined)
        throw new Error('no private key');
      input.privateKey = this.vIn[n].privateKey;
    }

    console.log('INPUT PRIVCATE KEY', input.privateKey);

    if (input.privateKey instanceof Array) {
      // @ts-ignore
      input.publicKey = [];
      let pk = [];
      for (let key of input.privateKey) {
        if (key.key !== undefined) key = key.wif;
        // @ts-ignore
        input.publicKey.push(privateToPublicKey(key, {hex: false}));
        pk.push(new PrivateKey(key).key);
      }
      // @ts-ignore
      input.privateKey = pk;
    } else {
      // @ts-ignore
      if (input.privateKey.key === undefined) {
        // @ts-ignore
        let k = new PrivateKey(input.privateKey);
        input.privateKey = k.key;
        // @ts-ignore
        input.privateKeyCompressed = k.compressed;
      } else {
        // @ts-ignore
        input.privateKeyCompressed = input.privateKey.compressed;
        // @ts-ignore
        input.privateKey = input.privateKey.key;
      }
      //@ts-ignore
      console.log('FFFF-2', input.privateKey.length);
      // @ts-ignore
      input.publicKey = [
        // @ts-ignore
        privateToPublicKey(input.privateKey, input.privateKeyCompressed),
      ];

      console.log('FFFF-3');
      // @ts-ignore
      input.privateKey = [input.privateKey];
    }

    console.log('INPUT PRIVCATE KEY', input.privateKey);
    // @ts-ignore
    console.log('INPUT PRIVCATE KEY', input.privateKeyCompressed);
    console.log('INPUT PRIVCATE KEY', input.publicKey[0].toString('hex'));

    // address

    if (input.address === null && this.vIn[n].address !== undefined)
      input.address = this.vIn[n].address;
    if (input.address !== null) {
      // @ts-ignore
      if (input.address.address !== undefined)
        // @ts-ignore
        input.address = input.address.address;

      // @ts-ignore
      if (this.testnet !== (addressNetType(input.address) === 'testnet'))
        throw new Error('address network invalid');
      // @ts-ignore
      input.scriptPubKey = addressToScript(input.address);
    }
    // @ts-ignore
    let scriptType = null;

    // redeem script
    if (input.redeemScript === null && this.vIn[n].redeemScript !== undefined)
      input.redeemScript = this.vIn[n].redeemScript;
    if (input.redeemScript !== null)
      input.redeemScript = getBuffer(input.redeemScript);

    // script pub key
    if (input.scriptPubKey === null && this.vIn[n].scriptPubKey !== undefined)
      input.scriptPubKey = this.vIn[n].scriptPubKey;
    else if (input.scriptPubKey === null && input.redeemScript === null)
      throw new Error('no scriptPubKey key');

    if (input.scriptPubKey !== null) {
      input.scriptPubKey = getBuffer(input.scriptPubKey);

      let p = parseScript(input.scriptPubKey);
      scriptType = p.type;
      // @ts-ignore
      if ([5, 6].includes(p.nType))
        // @ts-ignore
        input.witnessVersion = input.scriptPubKey[0];
    } else if (input.redeemScript !== null) {
      // @ts-ignore
      if (input.witnessVersion === null || input.p2sh_p2wsh)
        scriptType = 'P2SH';
      else scriptType = 'P2WSH';
    }

    console.log('INPUT PUBL KEY', input.scriptPubKey.toString('hex'));
    //@ts-ignore
    console.log('INPUT PUBL KEY', input.publicKey[0].toString('hex'));

    // sign input
    let sigSript = this.__sign_P2WPKH(n, input);

    if (this.format === 'raw') this.vIn[n].scriptSig = sigSript;
    else {
      this.vIn[n].scriptSig = sigSript.toString('hex');
      this.vIn[n].scriptSigOpcodes = decodeScript(sigSript);
      this.vIn[n].scriptSigAsm = decodeScript(sigSript, true);
    }
    if (this.autoCommit) this.commit();
    return this;
  }

  __sign_P2WPKH(n: number, input: vInput) {
    let s = Buffer.concat([
      Buffer.from([0x19]),
      Buffer.from([OPCODE.OP_DUP, OPCODE.OP_HASH160]),
      // @ts-ignore
      input.scriptPubKey.slice(1),
      Buffer.from([OPCODE.OP_EQUALVERIFY, OPCODE.OP_CHECKSIG]),
    ]);
    if (input.value === null) {
      if (this.vIn[n].value !== undefined) input.value = this.vIn[n].value;
      else throw new Error('no input amount');
    }

    console.log(
      'SIGHASH',
      n,
      s.toString('hex'),
      input.sigHashType,
      input.value,
    );
    let sighash = this.sigHashSegwit(n, s, input.sigHashType, input.value);

    console.log('SIGHASH==!)!))!!)!)', input.sigHashType);
    console.log('SIGHASH==!)!))!!)!)', input.scriptPubKey.toString('hex'));
    console.log('SIGHASH==!)!))!!)!)', s.toString('hex'));
    console.log('SIGHASH==!)!))!!)!)', sighash.toString('hex'));

    // const
    // @ts-ignore
    let signature =signMessage(sighash, input.privateKey[0])
    //     Buffer.concat([
    //   // @ts-ignore
    //   signMessage(sighash, input.privateKey[0]),
    //   Buffer.from(intToBytes(input.sigHashType, 1)),
    // ]);

    console.log('SIGNATURE', signature);
    this.segwit = true;
    if (this.format === 'raw')
      // @ts-ignore
      this.vIn[n].txInWitness = [signature, input.publicKey[0]];
    // @ts-ignore
    else
      this.vIn[n].txInWitness = [
        signature.toString('hex'),
        //@ts-ignore
        input.publicKey[0].toString('hex'),
      ];
    // @ts-ignore
    this.vIn[n].signatures =
      this.format === 'raw' ? [signature] : [signature.toString('hex')];
    return Buffer.from([]);
  }
}

export function signMessage(buffer: Buffer, privateKey: Buffer): Buffer {
  console.log('BGL Signed Message:\n');
  console.log(buffer.length);
  console.log(privateKey);
  let result = sign(buffer, privateKey);

  return encode(result, SIGHASH_ALL);
}
