/*
 * Copyright (c) 2020. Mikael Lazarev
 */

export interface Transaction {
  id: string;
  type: 'RECEIVE' | 'SEND';
  amount: number;
  confirmation: number;
}
