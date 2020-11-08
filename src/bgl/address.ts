/*
 * Copyright (c) 2020. Mikael Lazarev
 */

import {pointFromScalar} from 'tiny-secp256k1';
import {
  ADDRESS_PREFIX_LIST,
  MAINNET_ADDRESS_PREFIX,
  MAINNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX,
  MAINNET_SCRIPT_ADDRESS_PREFIX,
  MAINNET_SEGWIT_ADDRESS_PREFIX,
  TESTNET_ADDRESS_PREFIX,
  TESTNET_ADDRESS_PREFIX_2,
  TESTNET_SCRIPT_ADDRESS_PREFIX,
  TESTNET_SEGWIT_ADDRESS_PREFIX,
} from './constants';
import {
  hashToAddress,
  rebase_32_to_5,
  rebase_5_to_32,
  rebase_5_to_8,
  rebase_8_to_5,
} from './hrr';
import {hash160} from './hash';
import {OPCODE} from './opcode';

const bech32 = require('bech32');
const bs58 = require('bs58');

export class PublicKey {
  private readonly privateKey: Buffer;
  private readonly compressed: boolean;

  constructor(privateKey: Buffer, compressed?: boolean) {
    this.privateKey = privateKey;
    this.compressed = compressed || true;

    // if (
    //   // @ts-ignore
    //   privateKey.buffer[0] === MAINNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX ||
    //   // @ts-ignore
    //   privateKey.buffer[0] === MAINNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX
    // ) {
    //   this.compressed = false;
    // }
    // this.privateKey = privateKey.slice(1, 33);
  }

  get publicKey(): Buffer | null {
    return pointFromScalar(this.privateKey, this.compressed);
  }

  address(net: string): string {
    console.log(this.publicKey);
    if (this.publicKey === null) throw new Error('Null pubkeh');
    const hash = hash160(this.publicKey);
    console.log(hash.toString('hex'));

    const ha = rebase_8_to_5(Array.from(hash), true);
    console.log('HAS', Buffer.from(rebase_5_to_32(ha)).toString());
    return hashToAddress(ha, net === 'testnet');

    // return hrp + '1';
    // const address_hash = b"%s%s" % (witness_version.to_bytes(1, "big"),
    //     rebase_8_to_5(address_hash))
    //
    // checksum = bech32_polymod(b"%s%s%s" % (prefix, address_hash, b"\x00" * 6))
    // checksum = rebase_8_to_5(checksum.to_bytes(5, "big"))[2:]
    // return "%s1%s" % (hrp, rebase_5_to_32(address_hash + checksum).decode())
  }
}

export function addressToScript(address: Buffer) {
  if (
    [TESTNET_SCRIPT_ADDRESS_PREFIX, MAINNET_SCRIPT_ADDRESS_PREFIX].includes(
      address[0],
    )
  ) {
    console.log('===1');
    const s = Buffer.concat([
      Buffer.from([OPCODE.OP_HASH160, 0x14]),
      this.addressToHash(address),
      Buffer.from([OPCODE.OP_EQUAL]),
    ]);
    return s.toString('hex');
  }
  if (
    [
      MAINNET_ADDRESS_PREFIX,
      TESTNET_ADDRESS_PREFIX,
      TESTNET_ADDRESS_PREFIX_2,
    ].includes(address[0])
  ) {
    console.log('===2');
    const s = Buffer.concat([
      Buffer.from([OPCODE.OP_DUP, OPCODE.OP_HASH160, 0x14]),
      // @ts-ignore
      addressToHash(address),
      Buffer.from([OPCODE.OP_EQUALVERIFY, OPCODE.OP_CHECKSIG]),
    ]);
    return s.toString('hex');
  }
  if (
    [TESTNET_SEGWIT_ADDRESS_PREFIX, MAINNET_SEGWIT_ADDRESS_PREFIX].includes(
      // @ts-ignore
      address.split('1')[0],
    )
  ) {
    console.log('==3');
    // @ts-ignore
    let h = addressToHash(address);
    const s = Buffer.concat([
      Buffer.from([OPCODE.OP_0, h.length]),
      // @ts-ignore
      addressToHash(address),
    ]);
    return s.toString('hex');
  }
  throw new Error('address invalid');
}

export function addressToHash(address: string): Buffer | null {
  let h;
  if (ADDRESS_PREFIX_LIST.includes(address[0])) {
    h = bs58.decode(address) as Buffer;
    h = h.slice(1, h.length - 4);
  } else if (
    [MAINNET_SEGWIT_ADDRESS_PREFIX, TESTNET_SEGWIT_ADDRESS_PREFIX].includes(
      address.split('1')[0],
    )
  ) {
    let q = rebase_32_to_5(address.split('1')[1]);
    h = Buffer.from(rebase_5_to_8(q.slice(1, q.length - 6), false));
  } else return null;
  return h;
}

export function privateToPublicKey(
  privateKey: Buffer,
  compressed: boolean,
): Buffer | null {
  const pk = new PublicKey(privateKey, compressed);
  return pk.publicKey;
}
