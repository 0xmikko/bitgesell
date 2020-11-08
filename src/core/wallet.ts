/*
 * Copyright (c) 2020. Mikael Lazarev
 */

export interface Wallet {
  address?: string;
  address?: string;
  privateKey?: string;
  mnemonic?: string;
  state: 'WALLET_STARTUP' | 'WALLET_NOT_SET' | 'WALLET_SET';
  isUnlocked: boolean;
  balance: number;
}
