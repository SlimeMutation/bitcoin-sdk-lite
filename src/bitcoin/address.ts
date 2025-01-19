import * as bitcoin from 'bitcoinjs-lib';
const ecc = require('tiny-secp256k1');
const { BIP32Factory } = require('bip32');
const bip32 = BIP32Factory(ecc);

export type NetworkType = 'bitcoin' | 'testnet' | 'regtest';

interface CreateAddressParams {
  seedHex: string;
  receiveOrChange: string;
  addressIndex: number;
  network: NetworkType;
  method: string;
}

export function createAddress(params: CreateAddressParams): { privateKey: string; publicKey: string; address: string } {
  const { seedHex, receiveOrChange, addressIndex, network, method } = params;
  const root = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
  let path = "m/44'/0'/0'/0/" + addressIndex + '';
  if (receiveOrChange === '1') {
    path = "m/44'/0'/0'/1/" + addressIndex + '';
  }
  const child = root.derivePath(path);
  let address = '';
  switch (method) {
    case 'p2pkh': {
      const p2pkhAddress = bitcoin.payments.p2pkh({
        pubkey: child.publicKey,
        network: bitcoin.networks[network as keyof typeof bitcoin.networks]
      });
      if (!p2pkhAddress.address) {
        throw new Error('Failed to generate p2pkh address');
      }
      address = p2pkhAddress.address;
      break;
    }
    case 'p2wpkh': {
      const p2wpkhAddress = bitcoin.payments.p2wpkh({
        pubkey: child.publicKey,
        network: bitcoin.networks[network as keyof typeof bitcoin.networks]
      });
      if (!p2wpkhAddress.address) {
        throw new Error('Failed to generate p2wpkh address');
      }
      address = p2wpkhAddress.address;
      break;
    }
    case 'p2sh': {
      const p2shAddress = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wpkh({
          pubkey: child.publicKey,
          network: bitcoin.networks[network as keyof typeof bitcoin.networks]
        })
      });
      if (!p2shAddress.address) {
        throw new Error('Failed to generate p2sh address');
      }
      address = p2shAddress.address;
      break;
    }
    default:
      throw new Error(`Unsupported method: ${method}`);
  }

  return {
    privateKey: Buffer.from(child.privateKey).toString('hex'),
    publicKey: Buffer.from(child.publicKey).toString('hex'),
    address
  };
}

interface CreateMultiSignAddressParams {
  pubkeys: Buffer[];
  network: NetworkType;
  method: string;
  threshold: number;
}

export function createMultiSignAddress(params: CreateMultiSignAddressParams): string {
  const { pubkeys, network, method, threshold } = params;
  
  const getAddress = (payment: any): string => {
    const address = payment.address;
    if (!address) {
      throw new Error('Failed to generate multisig address');
    }
    return address;
  };

  switch (method) {
    case 'p2pkh': {
      const payment = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2ms({
          m: threshold,
          network: bitcoin.networks[network as keyof typeof bitcoin.networks],
          pubkeys
        })
      });
      return getAddress(payment);
    }
    case 'p2wpkh': {
      const payment = bitcoin.payments.p2wsh({
        redeem: bitcoin.payments.p2ms({
          m: threshold,
          network: bitcoin.networks[network as keyof typeof bitcoin.networks],
          pubkeys
        })
      });
      return getAddress(payment);
    }
    case 'p2sh': {
      const payment = bitcoin.payments.p2sh({
        redeem: bitcoin.payments.p2wsh({
          redeem: bitcoin.payments.p2ms({
            m: threshold,
            network: bitcoin.networks[network as keyof typeof bitcoin.networks],
            pubkeys
          })
        })
      });
      return getAddress(payment);
    }
    default:
      throw new Error(`Unsupported multisig method: ${method}`);
  }
}

interface CreateSchnorrAddressParams {
  seedHex: string;
  receiveOrChange: string;
  addressIndex: number;
}

interface SchnorrAddressResult {
  privateKey: string;
  publicKey: string;
  address: string;
}

export function createSchnorrAddress(params: CreateSchnorrAddressParams): SchnorrAddressResult {
  bitcoin.initEccLib(ecc);
  const { seedHex, receiveOrChange, addressIndex } = params;
  
  const root = bip32.fromSeed(Buffer.from(seedHex, 'hex'));
  let path = "m/44'/0'/0'/0/" + addressIndex + '';
  if (receiveOrChange === '1') {
    path = "m/44'/0'/0'/1/" + addressIndex + '';
  }
  
  const childKey = root.derivePath(path);
  const privateKey = childKey.privateKey;
  if (!privateKey) {
    throw new Error('No private key found');
  }

  const publicKey = childKey.publicKey;
  if (!publicKey) {
    throw new Error('No public key found');
  }

  // 生成 P2TR 地址
  const payment = bitcoin.payments.p2tr({
    internalPubkey: publicKey.length === 32 ? publicKey : publicKey.slice(1, 33)
  });

  if (!payment.address) {
    throw new Error('Failed to generate Schnorr address');
  }

  return {
    privateKey: Buffer.from(privateKey).toString('hex'),
    publicKey: Buffer.from(publicKey).toString('hex'),
    address: payment.address
  };
}
