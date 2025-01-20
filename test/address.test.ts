import * as bip39 from "bip39";
import { createAddress, createMultiSignAddress, createSchnorrAddress, createSchnorrAddress2 } from "../src/bitcoin/address_copy";
import type { NetworkType } from "../src/bitcoin/address_copy";
import * as assert from 'assert';

const NETWORK: NetworkType = 'bitcoin';

describe('Test for script', () => {
    test('createAddress p2pkh', () => {
        const mnemonic = '参 请 片 吨 子 爆 糊 避 养 锦 扎 熙';
        const seed = bip39.mnemonicToSeedSync(mnemonic, '');
        const param = {
            seedHex: seed.toString('hex'),
            receiveOrChange: '0',
            addressIndex: 0,
            network: NETWORK,
            method: 'p2pkh'
        };
        const {privateKey, publicKey, address} = createAddress(param);
        console.log(`p2pkh - address:${address} - privateKey:${privateKey} - publicKey:${publicKey}`)
    });
    test('createAddress p2wpkh', () => {
        const mnemonic = '参 请 片 吨 子 爆 糊 避 养 锦 扎 熙';
        const seed = bip39.mnemonicToSeedSync(mnemonic, '');
        const param = {
            seedHex: seed.toString('hex'),
            receiveOrChange: '0',
            addressIndex: 0,
            network: NETWORK,
            method: 'p2wpkh'
        };
        const {privateKey, publicKey, address} = createAddress(param);
        console.log(`p2wpkh - address:${address} - privateKey:${privateKey} - publicKey:${publicKey}`)
    });
    test('createAddress p2sh', () => {
        const mnemonic = '参 请 片 吨 子 爆 糊 避 养 锦 扎 熙';
        const seed = bip39.mnemonicToSeedSync(mnemonic, '');
        const param = {
            seedHex: seed.toString('hex'),
            receiveOrChange: '0',
            addressIndex: 0,
            network: NETWORK,
            method: 'p2sh'
        };
        const {privateKey, publicKey, address} = createAddress(param);
        console.log(`p2sh - address:${address} - privateKey:${privateKey} - publicKey:${publicKey}`)
    });
    test('createMultiSignAddress p2pkh', () => {
        const param = {
            pubkeys: [
            '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
            '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
            '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        ].map(hex => Buffer.from(hex, 'hex')),
            threshold: 2,
            network: NETWORK,
            method: 'p2pkh'
        };
        const address = createMultiSignAddress(param);
        console.log(`createMultiSignAddress p2pkh - address:${address}`)
    });
    test('createMultiSignAddress p2wpkh', () => {
        const param = {
            pubkeys: [
            '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
            '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
            '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        ].map(hex => Buffer.from(hex, 'hex')),
            threshold: 2,
            network: NETWORK,
            method: 'p2wpkh'
        };
        const address = createMultiSignAddress(param);
        console.log(`createMultiSignAddress p2wpkh - address:${address}`)
    });
    test('createMultiSignAddress p2sh', () => {
        const param = {
            pubkeys: [
            '026477115981fe981a6918a6297d9803c4dc04f328f22041bedff886bbc2962e01',
            '02c96db2302d19b43d4c69368babace7854cc84eb9e061cde51cfa77ca4a22b8b9',
            '03c6103b3b83e4a24a0e33a4df246ef11772f9992663db0c35759a5e2ebf68d8e9',
        ].map(hex => Buffer.from(hex, 'hex')),
            threshold: 2,
            network: NETWORK,
            method: 'p2sh'
        };
        const address = createMultiSignAddress(param);
        console.log(`createMultiSignAddress p2sh - address:${address}`)
    });
    test('createSchnorrAddress', () => {
        const mnemonic = '参 请 片 吨 子 爆 糊 避 养 锦 扎 熙';
        const seed = bip39.mnemonicToSeedSync(mnemonic, '');
        const param = {
            seedHex: seed.toString('hex'),
            receiveOrChange: '0',
            addressIndex: 0
        };
        const {privateKey, publicKey, address} = createSchnorrAddress(param);
        console.log(`createSchnorrAddress - address:${address} - privateKey:${privateKey} - publicKey:${publicKey}`)
    });
    test('createSchnorrAddress2', () => {
        const mnemonic = '参 请 片 吨 子 爆 糊 避 养 锦 扎 熙';
        const seed = bip39.mnemonicToSeedSync(mnemonic, '');
        const param = {
            seedHex: seed.toString('hex'),
            receiveOrChange: '0',
            addressIndex: 0
        };
        const {privateKey, publicKey, address} = createSchnorrAddress2(param);
        console.log(`createSchnorrAddress2 - address:${address} - privateKey:${privateKey} - publicKey:${publicKey}`)
    });
});
