/*
 * Copyright (c) 2020. Mikael Lazarev
 */
import BN from 'bn.js';
import {OPCODE, RAW_OPCODE} from './opcode';
import {
  MAINNET_ADDRESS_BYTE_PREFIX,
  MAINNET_ADDRESS_PREFIX,
  MAINNET_SCRIPT_ADDRESS_BYTE_PREFIX,
  MAINNET_SCRIPT_ADDRESS_PREFIX,
  MAINNET_SEGWIT_ADDRESS_BYTE_PREFIX,
  MAINNET_SEGWIT_ADDRESS_PREFIX,
  TESTNET_ADDRESS_BYTE_PREFIX,
  TESTNET_ADDRESS_PREFIX,
  TESTNET_ADDRESS_PREFIX_2,
  TESTNET_SCRIPT_ADDRESS_BYTE_PREFIX,
  TESTNET_SCRIPT_ADDRESS_PREFIX,
  TESTNET_SEGWIT_ADDRESS_BYTE_PREFIX,
  TESTNET_SEGWIT_ADDRESS_PREFIX,
} from './constants';
let INT_BASE32_MAP = {};
let BASE32_INT_MAP = {};
let BASE32CHARSET = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
let BASE32CHARSET_UPCASE = 'QPZRY9X8GF2TVDW0S3JN54KHCE6MUA7L';

for (let i = 0; i < BASE32CHARSET.length; i++) {
  //@ts-ignore
  INT_BASE32_MAP[BASE32CHARSET[i]] = i;
  //@ts-ignore
  BASE32_INT_MAP[i] = BASE32CHARSET.charCodeAt(i);
}
for (let i = 0; i < BASE32CHARSET_UPCASE.length; i++)
  //@ts-ignore
  INT_BASE32_MAP[BASE32CHARSET_UPCASE[i]] = i;

export const rebaseBits = (
  data: any,
  fromBits: number,
  toBits: number,
  pad?: boolean,
) => {
  if (pad === undefined) pad = true;
  let acc = 0,
    bits = 0,
    ret = [];
  let maxv = (1 << toBits) - 1;
  let max_acc = (1 << (fromBits + toBits - 1)) - 1;
  for (let i = 0; i < data.length; i++) {
    let value = data[i];
    if (value < 0 || value >> fromBits) throw 'invalid bytes';
    acc = ((acc << fromBits) | value) & max_acc;
    bits += fromBits;
    while (bits >= toBits) {
      bits -= toBits;
      ret.push((acc >> bits) & maxv);
    }
  }
  if (pad === true) {
    if (bits) ret.push((acc << (toBits - bits)) & maxv);
  } else if (bits >= fromBits || (acc << (toBits - bits)) & maxv)
    throw 'invalid padding';
  return ret;
};

export function rebase_5_to_8(data: any, pad?: boolean) {
  if (pad === undefined) pad = true;
  return rebaseBits(data, 5, 8, pad);
}

export function rebase_8_to_5(data: any, pad?: boolean) {
  if (pad === undefined) pad = true;
  return rebaseBits(data, 8, 5, pad);
}

export const bytesToString = function (bytes: any[]) {
  return bytes
    .map(function (x) {
      return String.fromCharCode(x);
    })
    .join('');
};

export function rebase_32_to_5(data: any) {
  if (typeof data !== 'string') data = bytesToString(data);
  let b = [];
  try {
    // @ts-ignore
    for (let i = 0; i < data.length; i++) b.push(INT_BASE32_MAP[data[i]]);
  } catch (err) {
    throw 'Non base32 characters';
  }
  return b;
}

export const rebase_5_to_32 = (data: any) => {
  let r = [];
  //@ts-ignore
  for (let i = 0; i < data.length; i++) r.push(BASE32_INT_MAP[data[i]]);
  return r;
};

export const bech32Polymod = (values: any) => {
  let generator = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
  let chk = 1;
  for (let i = 0; i < values.length; i++) {
    let top = chk >> 25;
    chk = ((chk & 0x1ffffff) << 5) ^ values[i];
    for (let k = 0; k < 5; k++) {
      if ((top >> k) & 1) chk ^= generator[k];
      else chk ^= 0;
    }
  }
  return chk ^ 1;
};

export function intToBytes(
  x: number,
  n: number,
  byte_order: string = 'little',
): Array<number> {
  let bytes = [];
  let i = n;
  if (n === undefined) throw new Error('bytes count required');
  if (byte_order !== 'big' && byte_order !== 'little')
    throw new Error('invalid byte order');
  let b = byte_order === 'big';
  if (n <= 4)
    do {
      b ? bytes.unshift(x & 255) : bytes.push(x & 255);
      x = x >> 8;
    } while (--i);
  else {
    const xBn = new BN(x);
    // @ts-ignore
    bytes = xBn.toArrayLike(Array, b ? 'be' : 'le', n);
  }
  return bytes;
}

export function varIntToInt(s: Array<number>, bn: boolean = false) {
  let r;
  if (s[0] < 0xfd) r = new BN(s[0]);
  else if (s[0] < 0xffff) r = new BN(s.slice(1, 3), 'le');
  else if (s[0] < 0xffffffff) r = new BN(s.slice(1, 4), 'le');
  else r = new BN(s.slice(1, 8), 'le');
  if (bn) return r;
  return r.toNumber();
}

export const rh2s = (s: any) => Buffer.from(s).reverse().toString('hex');
export const s2rh = (s: string) => Buffer.from(s, 'hex').reverse();

export const isString = function (value: any) {
  return typeof value === 'string' || value instanceof String;
};

export const isHex = (s: any) =>
  Boolean(/^[0-9a-fA-F]+$/.test(s) && !(s.length % 2));

export function getBuffer(m: any, encoding = 'hex') {
  if (Buffer.isBuffer(m)) {
    // @ts-ignore
    if (m.read === undefined) return Buffer.from(m);
    return m;
  }
  if (isString(m)) {
    if (m.length === 0) return Buffer(0);
    const encodingArr = encoding.split('|');
    for (let e of encodingArr) {
      if (e === 'hex') {
        if (isHex(m)) return Buffer.from(m, e);
      } else if (e === 'utf8') return Buffer.from(m, e);
    }
    throw new Error(encoding + ' encoding required :' + encoding);
  }
  return Buffer.from(m);
}

export function intToVarInt(i: number | BN) {
  let r;
  if (i instanceof BN) {
    // @ts-ignore
    if (i.lt(0xfd)) r = i.toArrayLike(Array, 'le', 1);
    // @ts-ignore
    else if (i.lt(0xffff)) r = [0xfd].concat(i.toArrayLike(Array, 'le', 2));
    // @ts-ignore
    else if (i.lt(0xffffffff)) r = [0xfe].concat(i.toArrayLike(Array, 'le', 4));
    // @ts-ignore
    else r = [0xff].concat(i.toArrayLike(Array, 'le', 8));
    return r;
  } else if (!isNaN(i)) {
    if (i < 0xfd) r = [i];
    else if (i < 0xffff) r = [0xfd].concat(intToBytes(i, 2, 'little'));
    else if (i < 0xffffffff) r = [0xfe].concat(intToBytes(i, 4, 'little'));
    else r = [0xff].concat(intToBytes(i, 8, 'little'));
    return r;
  } else {
    // @ts-ignore
    throw new Error('invalid argument type', i);
  }
}

export function parseScript(s: any) {
  const segwit = true;
  s = getBuffer(s);
  let l = s.length;
  if (l === 0) return {nType: 7, type: 'NON_STANDARD', reqSigs: 0, script: s};
  if (segwit) {
    if (l === 22 && s[0] === 0)
      return {nType: 5, type: 'P2WPKH', reqSigs: 1, addressHash: s.slice(2)};
    if (l === 34 && s[0] === 0)
      return {nType: 6, type: 'P2WSH', reqSigs: null, addressHash: s.slice(2)};
  }

  if (
    l === 25 &&
    s[0] === 0x76 &&
    s[1] === 0xa9 &&
    s[l - 2] === 0x88 &&
    s[l - 1] === 0xac
  )
    return {nType: 0, type: 'P2PKH', reqSigs: 1, addressHash: s.slice(3, -2)};
  if (l === 23 && s[0] === 169 && s[l - 1] === 135)
    return {nType: 1, type: 'P2SH', reqSigs: null, addressHash: s.slice(2, -1)};
  if ((l === 67 || l === 35) && s[l - 1] === 172)
    return {
      nType: 2,
      type: 'PUBKEY',
      reqSigs: 1,
      addressHash: S.hash160(s.slice(1, -1)),
    };

  if (s[0] === OPCODE.OP_RETURN) {
    if (l === 1)
      return {nType: 3, type: 'NULL_DATA', reqSigs: 0, data: s.slice(1)};
    if (s[1] < OPCODE.OP_PUSHDATA1 && s[1] === l - 2)
      return {nType: 3, type: 'NULL_DATA', reqSigs: 0, data: s.slice(2)};
    if (s[1] === OPCODE.OP_PUSHDATA1 && l > 2 && s[2] === l - 3 && s[2] <= 80)
      return {nType: 3, type: 'NULL_DATA', reqSigs: 0, data: s.slice(3)};
    return {nType: 8, type: 'NULL_DATA_NON_STANDARD', reqSigs: 0, script: s};
  }

  if (
    s[0] >= 81 &&
    s[0] <= 96 &&
    s[l - 1] === 174 &&
    s[l - 2] >= 81 &&
    s[l - 2] <= 96 &&
    s[l - 2] >= s[0]
  ) {
    let c = 0,
      q = 1;
    while (l - q - 2 > 0) {
      if (s[q] < 0x4c) {
        q += s[q];
        c++;
      } else {
        q = 0;
        break;
      }
      q++;
    }
    if (c === s[l - 2] - 80)
      return {
        nType: 4,
        type: 'MULTISIG',
        reqSigs: s[0] - 80,
        pubKeys: c,
        script: s,
      };
  }

  let q = 0,
    m = 0,
    n = 0,
    last = 0,
    r = 0;
  while (l - q > 0) {
    if (s[q] >= 81 && s[q] <= 96) {
      if (!n) n = s[q] - 80;
      else {
        if (m === 0 || m > n) {
          n = s[q] - 80;
          m = 0;
        } else if (m === s[q] - 80) last = last ? 0 : 2;
      }
    } else if (s[q] < 0x4c) {
      q += s[q];
      m++;
      if (m > 16) {
        m = 0;
        n = 0;
      }
    } else if (s[q] === OPCODE.OP_PUSHDATA1) {
      if (s[q + 1] === undefined) break;
      q += 1 + s[q + 1];
    } else if (s[q] === OPCODE.OP_PUSHDATA2) {
      if (s[q + 1] === undefined) break;
      q += 2 + s.readIntLE(q, 2);
    } else if (s[q] === OPCODE.OP_PUSHDATA4) {
      if (s[q + 3] === undefined) break;
      q += 4 + s.readIntLE(q, 4);
    } else {
      if (s[q] === OPCODE.OP_CHECKSIG) r++;
      else if (s[q] === OPCODE.OP_CHECKSIGVERIFY) r++;
      else if (
        [OPCODE.OP_CHECKMULTISIG, OPCODE.OP_CHECKMULTISIGVERIFY].includes(s[q])
      ) {
        if (last) r += n;
        else r += 20;
      }
      n = 0;
      m = 0;
    }
    if (last) last--;
    q++;
  }
  return {nType: 7, type: 'NON_STANDARD', reqSigs: r, script: s};
}

export function hashToAddress(
  ha: any,
  testnet: boolean = false,
  scriptHash: boolean = false,
) {
  const prefix = testnet
    ? TESTNET_SEGWIT_ADDRESS_BYTE_PREFIX
    : MAINNET_SEGWIT_ADDRESS_BYTE_PREFIX;
  const hrp = testnet
    ? TESTNET_SEGWIT_ADDRESS_PREFIX
    : MAINNET_SEGWIT_ADDRESS_PREFIX;

  // if (!scriptHash) {
  //   if (A.witnessVersion === null) {
  //     if (ha.length !== 20) throw new Error('address hash length incorrect');
  //     if (A.testnet) prefix = BF(S.TESTNET_ADDRESS_BYTE_PREFIX);
  //     else prefix = BF(S.MAINNET_ADDRESS_BYTE_PREFIX);
  //     let h = BC([prefix, ha]);
  //     h = BC([h, S.doubleSha256(h, {hex: false}).slice(0, 4)]);
  //     return S.encodeBase58(h);
  //   } else if ((ha.length !== 20) && (ha.length !== 32))
  //     throw new Error('address hash length incorrect');
  // }
  ha.unshift(0); //witnessVersion);

  console.log(ha);
  console.log('PREFIX', prefix);

  // @ts-ignore
  let checksum = bech32Polymod(prefix.concat(ha.concat([0, 0, 0, 0, 0, 0])));

  console.log(checksum);
  const checksum2 = rebase_8_to_5(getInt64Bytes(checksum)).slice(2);

  const partAddre = rebase_5_to_32(ha.concat(checksum2));
  console.log(Buffer.from(partAddre).toString());
  console.log('FINISHED');
  // @ts-ignore
  return hrp + '1' + Buffer.from(partAddre);
}

function getInt64Bytes(x: number): Array<number> {
  var bytes = [];
  var i = 5;
  do {
    bytes[--i] = x & 255;
    x = x >> 8;
  } while (i);
  return bytes;
}

export function addressNetType(a: string) {
  if ([MAINNET_SCRIPT_ADDRESS_PREFIX, MAINNET_ADDRESS_PREFIX].includes(a[0]))
    return 'mainnet';
  if (a.slice(0, 3) === MAINNET_SEGWIT_ADDRESS_PREFIX) return 'mainnet';
  if (
    [
      TESTNET_SCRIPT_ADDRESS_PREFIX,
      TESTNET_ADDRESS_PREFIX,
      TESTNET_ADDRESS_PREFIX_2,
    ].includes(a[0])
  )
    return 'testnet';
  if (a.slice(0, 4) === TESTNET_SEGWIT_ADDRESS_PREFIX) return 'testnet';
  return null;
}

export function decodeScript(s: Buffer | string, asm: boolean = false) {
  const sBuffer = getBuffer(s);
  let l = sBuffer.length,
    q = 0,
    result = [];
  if (l === 0) return '';
  try {
    while (l - q > 0) {
      if (sBuffer[q] < 0x4c && sBuffer[q]) {
        if (asm) {
          result.push(`OP_PUSHBYTES[${sBuffer[q]}]`);
          result.push(sBuffer.slice(q + 1, q + 1 + sBuffer[q]).hex());
        } else result.push(`[${sBuffer[q]}]`);
        q += sBuffer[q] + 1;
        continue;
      }
      if (sBuffer[q] === OPCODE.OP_PUSHDATA1) {
        if (asm) {
          result.push(`OP_PUSHDATA1[${sBuffer[q + 1]}]`);
          result.push(sBuffer.slice(q + 2, q + 2 + sBuffer[q + 1]).hex());
        } else {
          result.push(RAW_OPCODE[sBuffer[q]]);
          result.push(`[${sBuffer[q + 1]}]`);
        }
        q += 1 + sBuffer[q + 1] + 1;
        continue;
      }
      if (sBuffer[q] === OPCODE.OP_PUSHDATA2) {
        let w = sBuffer.readIntLE(q + 1, 2);
        if (asm) {
          result.push(`OP_PUSHDATA2[${w}]`);
          result.push(sBuffer.slice(q + 3, q + 3 + w).hex());
        } else {
          result.push(RAW_OPCODE[sBuffer[q]]);
          result.push(`[${sBuffer[w]}]`);
        }
        q += w + 3;
        continue;
      }
      if (sBuffer[q] === OPCODE.OP_PUSHDATA4) {
        let w = sBuffer.readIntLE(q + 1, 4);
        if (asm) {
          result.push(`OP_PUSHDATA4[${w}]`);
          result.push(sBuffer.slice(q + 5, q + 5 + w).hex());
        } else {
          result.push(RAW_OPCODE[sBuffer[q]]);
          result.push(`[${sBuffer[w]}]`);
        }
        q += w + 6;
        continue;
      }
      result.push(RAW_OPCODE[sBuffer[q]]);
      q++;
    }
  } catch (e) {
    result.push('[SCRIPT_DECODE_FAILED]');
  }
  return result.join(' ');
}
