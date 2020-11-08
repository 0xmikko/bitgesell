/*
 * Copyright (c) 2020. Mikael Lazarev
 */

export class Transaction {
  id: string;
  type: 'RECEIVE' | 'SEND';
  amount: number;
  confirmations: number;
  time: number;
  hex: string;
}
