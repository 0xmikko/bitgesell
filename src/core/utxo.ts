/*
 * Copyright (c) 2020. Mikael Lazarev
 */

export class Unspent {
  txid: string;

  vout: number;

  scriptPubKey: string;
  desc: string;

  amount: number;

  height: number;
}

export class UTXO {
  success: boolean;
  txouts: number;
  height: number;
  bestblock: string;
  unspents: Unspent[];

  total_amount: number;
}
