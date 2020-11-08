/*
 * Copyright (c) 2020. Mikael Lazarev
 */

export const MAX_AMOUNT = 2100000000000000;
export const SIGHASH_ALL = 0x00000001;
export const SIGHASH_NONE = 0x00000002;
export const SIGHASH_SINGLE = 0x00000003;
export const SIGHASH_ANYONECANPAY = 0x00000080;
export const ECDSA_SEC256K1_ORDER = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141;

export const MAINNET_ADDRESS_BYTE_PREFIX = '\x00';
export const TESTNET_ADDRESS_BYTE_PREFIX = '\x6f';
export const MAINNET_SCRIPT_ADDRESS_BYTE_PREFIX = '\x05';
export const TESTNET_SCRIPT_ADDRESS_BYTE_PREFIX = '\xc4';
export const MAINNET_SEGWIT_ADDRESS_BYTE_PREFIX = [3, 3, 3, 0, 2, 7, 12];
export const TESTNET_SEGWIT_ADDRESS_BYTE_PREFIX = [3, 3, 0, 20, 2];



export const MAINNET_ADDRESS_PREFIX = '1';
export const TESTNET_ADDRESS_PREFIX = '2';
export const TESTNET_ADDRESS_PREFIX_2 = 'n';
export const MAINNET_SCRIPT_ADDRESS_PREFIX = 'S';
export const TESTNET_SCRIPT_ADDRESS_PREFIX = 's';

export const MAINNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX = '5';
export const MAINNET_PRIVATE_KEY_COMPRESSED_PREFIX = 'K';
export const MAINNET_PRIVATE_KEY_COMPRESSED_PREFIX_2 = 'L';
export const TESTNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX = '9';
export const TESTNET_PRIVATE_KEY_COMPRESSED_PREFIX = 'c';

export const ADDRESS_PREFIX_LIST = [
  MAINNET_ADDRESS_PREFIX,
  TESTNET_ADDRESS_PREFIX,
  TESTNET_ADDRESS_PREFIX_2,
  MAINNET_SCRIPT_ADDRESS_PREFIX,
  TESTNET_SCRIPT_ADDRESS_PREFIX,
];

export const PRIVATE_KEY_PREFIX_LIST = [
  MAINNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX,
  MAINNET_PRIVATE_KEY_COMPRESSED_PREFIX,
  MAINNET_PRIVATE_KEY_COMPRESSED_PREFIX_2,
  TESTNET_PRIVATE_KEY_UNCOMPRESSED_PREFIX,
  TESTNET_PRIVATE_KEY_COMPRESSED_PREFIX,
];

export const MAINNET_PRIVATE_KEY_BYTE_PREFIX = [0x80];
export const TESTNET_PRIVATE_KEY_BYTE_PREFIX = [0xef];

export const MAINNET_SEGWIT_ADDRESS_PREFIX = 'bgl';
export const TESTNET_SEGWIT_ADDRESS_PREFIX = 'tbgl';

export const SCRIPT_TYPES = {
  NULL_DATA: 3,
  MULTISIG: 4,
  P2WPKH: 5,
  P2WSH: 6,
  NON_STANDARD: 7,
  NULL_DATA_NON_STANDARD: 8,
};

export const SCRIPT_N_TYPES = {
  3: 'NULL_DATA',
  4: 'MULTISIG',
  5: 'P2WPKH',
  6: 'P2WSH',
  7: 'NON_STANDARD',
  8: 'NULL_DATA_NON_STANDARD',
};

// # CONSTANTS hierarchical deterministic wallets (HD Wallets)
// # m/44'/0' P2PKH
export const MAINNET_XPRIVATE_KEY_PREFIX = Buffer.from([0x04, 0x88, 0xad, 0xe4]);
export const MAINNET_XPUBLIC_KEY_PREFIX = Buffer.from([0x04, 0x88, 0xb2, 0x1e]);
// m/44'/1' P2PKH
export const TESTNET_XPRIVATE_KEY_PREFIX = Buffer.from([0x04, 0x35, 0x83, 0x94]);
export const TESTNET_XPUBLIC_KEY_PREFIX = Buffer.from([0x04, 0x35, 0x87, 0xcf]);
// m/44'/0' P2PKH
export const MAINNET_M44_XPRIVATE_KEY_PREFIX = Buffer.from([0x04, 0x88, 0xad, 0xe4]);
export const MAINNET_M44_XPUBLIC_KEY_PREFIX = Buffer.from([0x04, 0x88, 0xb2, 0x1e]);
// m/44'/1' P2PKH
export const TESTNET_M44_XPRIVATE_KEY_PREFIX = Buffer.from([0x04, 0x35, 0x83, 0x94]);
export const TESTNET_M44_XPUBLIC_KEY_PREFIX = Buffer.from([0x04, 0x35, 0x87, 0xcf]);
// m/49'/0' P2WPKH in P2SH
export const MAINNET_M49_XPRIVATE_KEY_PREFIX = Buffer.from([0x04, 0x9d, 0x78, 0x78]);
export const MAINNET_M49_XPUBLIC_KEY_PREFIX = Buffer.from([0x04, 0x9d, 0x7c, 0xb2]);
// m/49'/1' P2WPKH in P2SH
export const TESTNET_M49_XPRIVATE_KEY_PREFIX = Buffer.from([0x04, 0x4a, 0x4e, 0x28]);
export const TESTNET_M49_XPUBLIC_KEY_PREFIX = Buffer.from([0x04, 0x4a, 0x52, 0x62]);
// m/84'/0' P2WPKH
export const MAINNET_M84_XPRIVATE_KEY_PREFIX = Buffer.from([0x04, 0xb2, 0x43, 0x0c]);
export const MAINNET_M84_XPUBLIC_KEY_PREFIX = Buffer.from([0x04, 0xb2, 0x47, 0x46]);
// m/84'/1' P2WPKH
export const TESTNET_M84_XPRIVATE_KEY_PREFIX = Buffer.from([0x04, 0x5f, 0x18, 0xbc]);
export const TESTNET_M84_XPUBLIC_KEY_PREFIX = Buffer.from([0x04, 0x5f, 0x1c, 0xf6]);


export const HARDENED_KEY = 0x80000000;
export const FIRST_HARDENED_CHILD = 0x80000000;
export const PATH_LEVEL_BIP0044 = [0x8000002c, 0x80000000, 0x80000000, 0, 0];
export const TESTNET_PATH_LEVEL_BIP0044 = [
  0x8000002c,
  0x80000001,
  0x80000000,
  0,
  0,
];

export const MINER_COINBASE_TAG = {
  BitMinter: {name: 'BitMinter', link: 'https://bitminter.com/'},
  Eligius: {name: 'Eligius', link: 'http://eligius.st/'},
  'ghash.io': {name: 'GHash.IO', link: 'https://ghash.io/'},
  mmpool: {name: 'mmpool', link: 'http://mmpool.org/pool'},
  KnCMiner: {name: 'KnCMiner', link: 'http://www.kncminer.com/'},
  '/slush/': {name: 'Slush', link: 'http://mining.bitcoin.cz/'},
  'Mined by AntPool': {name: 'AntPool', link: 'https://www.antpool.com/'},
  'AntPool/': {name: 'AntPool', link: 'https://www.antpool.com/'},
  '/Kano': {name: 'Kano CK', link: 'https://kano.is/'},
  '/NiceHashSolo': {name: 'NiceHash Solo', link: 'https://solo.nicehash.com/'},
  '/BitClub Network/': {name: 'BitClu', link: 'https://bitclubpool.com/'},
  'BTCChina Pool': {name: 'BTCC', link: 'https://pool.btcc.com/'},
  'btcchina.com': {name: 'BTCC', link: 'https://pool.btcc.com/'},
  'BTCChina.com': {name: 'BTCC', link: 'https://pool.btcc.com/'},
  '/BTCC/': {name: 'BTCC', link: 'https://pool.btcc.com/'},
  BTCC: {name: 'BTCC', link: 'https://pool.btcc.com/'},
  'BW Pool': {name: 'BW.COM', link: 'https://bw.com/'},
  '/BitFury/': {name: 'BitFury', link: 'http://bitfury.com/'},
  '/Bitfury/': {name: 'BitFury', link: 'http://bitfury.com/'},
  '/pool34/': {name: '21 Inc.', link: 'https://21.co/'},
  'Mined by 1hash.com': {name: '1Hash', link: 'https://1hash.com/'},
  HaoBTC: {name: 'HaoBTC', link: 'https://haobtc.com/'},
  BCMonster: {name: 'BCMonster', link: 'http://bitcoin.co.pt/'},
  ViaBTC: {name: 'ViaBTC', link: 'http://www.viabtc.com/'},
  'BTC.TOP': {name: 'BTC.TOP', link: 'http://btc.top'},
  'DPOOL.TOP': {name: 'DPOOL', link: 'https://www.dpool.top/'},
  'Rawpool.com': {name: 'Rawpool.com', link: 'https://www.rawpool.com/'},
  'ckpool.org': {name: 'CKPool', link: 'http://ckpool.org'},
  ckpool: {name: 'CKPool', link: 'http://ckpool.org'},
  KanoPool: {name: 'KanoPool', link: 'https://kano.is/'},
  Huobi: {name: 'Huobi', link: 'https://www.poolhb.com'},
  HuoBi: {name: 'Huobi', link: 'https://www.poolhb.com'},
  '58coin.com': {name: '58coin', link: 'http://58coin.com'},
  'pool.bitcoin.com': {name: 'Bitcoin.com', link: 'https://pool.bitcoin.com'},
  'BTC.COM': {name: 'BTC.COM', link: 'http://btc.com/'},
  gbminers: {name: 'gbminers', link: 'http://gbminers.com'},
  BATPOOL: {name: 'batpool', link: 'https://www.batpool.com'},
  'Bitcoin-India': {
    name: 'BitcoinIndia',
    link: 'https://pool.bitcoin-india.org',
  },
  Bixin: {name: 'Bixin', link: 'https://haopool.com/'},
  CANOE: {name: 'CANOE', link: 'https://www.canoepool.com/'},
  ConnectBTC: {name: 'ConnectBTC', link: 'https://www.connectbtc.com'},
  poolin: {name: 'Poolin', link: 'https://www.poolin.com'},
  'BW.com': {name: 'BW.com', link: 'https://bw.com'},
  'bw.com': {name: 'BW.com', link: 'https://bw.com'},
  SigmaPool: {name: 'SigmaPool', link: 'https://btc.sigmapool.com/'},
  BTPOOL: {name: 'BTPool', link: ''},
  'Bitcoin-Russia.ru': {
    name: 'Bitcoin Russia',
    link: 'https://bitcoin-russia.ru/',
  },
  'Kanpool.com': {name: 'Kanpool', link: 'http://kanpool.com'},
  'tigerpool.net': {name: 'Tiger pool', link: ''},
  'LTC.TOP': {name: 'LTC.TOP', link: ''},
  'prohashing.com': {name: 'prohashing.com', link: 'https://prohashing.com'},
  'GIVE-ME-COINS.com': {
    name: 'give-me-coins.com',
    link: 'http://give-me-coins.com',
  },
  XNPool: {name: 'XNPool', link: 'https://www.xnpool.cn'},
  Easy2Mine: {name: 'Easy2Mine', link: 'https://www.easy2mine.com'},
};

export const MINER_PAYOUT_TAG = {
  '1CK6KHY6MHgYvmRQ4PAafKYDrg1ejbH1cE': {
    name: 'Slush',
    link: 'https://slushpool.com',
  },
  '1AqTMY7kmHZxBuLUR5wJjPFUvqGs23sesr': {
    name: 'Slush',
    link: 'https://slushpool.com',
  },
  '1AcAj9p6zJn4xLXdvmdiuPCtY7YkBPTAJo': {
    name: 'BitFury',
    link: 'http://bitfury.com',
  },
  '3HuobiNg2wHjdPU2mQczL9on8WF7hZmaGd': {
    name: 'Huobi',
    link: 'http://www.huobi.com',
  },
  '1JLRXD8rjRgQtTS9MvfQALfHgGWau9L9ky': {
    name: 'BW.COM',
    link: 'https://www.bw.com',
  },
  '155fzsEBHy9Ri2bMQ8uuuR3tv1YzcDywd4': {
    name: 'BitClu',
    link: 'https://bitclubpool.com',
  },
  '14yfxkcpHnju97pecpM7fjuTkVdtbkcfE6': {
    name: 'BitFury',
    link: 'http://bitfury.com',
  },
  '15rQXUSBQRubShPpiJfDLxmwS8ze2RUm4z': {
    name: '21 Inc.',
    link: 'https://21.co',
  },
  '1CdJi2xRTXJF6CEJqNHYyQDNEcM3X7fUhD': {
    name: '21 Inc.',
    link: 'https://21.co',
  },
  '1GC6HxDvnchDdb5cGkFXsJMZBFRsKAXfwi': {
    name: '21 Inc.',
    link: 'https://21.co',
  },
  '1F1xcRt8H8Wa623KqmkEontwAAVqDSAWCV': {
    name: '1Hash',
    link: 'http://www.1hash.com',
  },
  '1P4B6rx1js8TaEDXvZvtrkiEb9XrJgMQ19': {
    name: 'Telco 214',
    link: 'http://www.telco214.com',
  },
  '1MoYfV4U61wqTPTHCyedzFmvf2o3uys2Ua': {
    name: 'Telco 214',
    link: 'http://www.telco214.com',
  },
  '1GaKSh2t396nfSg5Ku2J3Yn1vfVsXrGuH5': {
    name: 'Telco 214',
    link: 'http://www.telco214.com',
  },
  '1AsEJU4ht5wR7BzV6xsNQpwi5qRx4qH1ac': {
    name: 'Telco 214',
    link: 'http://www.telco214.com',
  },
  '1DXRoTT67mCbhdHHL1it4J1xsSZHHnFxYR': {
    name: 'Telco 214',
    link: 'http://www.telco214.com',
  },
  '1CNq2FAw6S5JfBiDkjkYJUVNQwjoeY4Zfi': {
    name: 'Telco 214',
    link: 'http://www.telco214.com',
  },
  '152f1muMCNa7goXYhYAQC61hxEgGacmnc': {
    name: 'BTCC',
    link: 'https://pool.btcc.com',
  },
  '3KJrsjfg1dD6CrsTeHdHVH3KqMpvL2XWQn': {
    name: 'Poolin',
    link: 'https://www.poolin.com',
  },
  '13hQVEstgo4iPQZv9C7VELnLWF7UWtF4Q3': {
    name: 'Bixin',
    link: 'https://haopool.com/',
  },
  '1GP8eWArgpwRum76saJS4cZKCHWJHs9PQo': {
    name: 'CANOE',
    link: 'https://www.canoepool.com/',
  },
};

export const LN2SQUARED = 0.4804530139182014246671025263266649717305529515945455;
export const LN2 = 0.6931471805599453094172321214581765680755001343602552;
