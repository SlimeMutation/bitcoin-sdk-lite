import { buildAndSignTx, signBtcTaprootTransaction } from "../src/bitcoin/sign_copy";
import * as bitcoin from "bitcoinjs-lib";
import { toXOnly } from 'bitcoinjs-lib/src/psbt/bip371';
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

const ECPair = ECPairFactory(ecc);

describe('buildAndSignTx test case', () => {
    test('offline sign tx', async () => {
        const data = {
            inputs: [
                {
                    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",  // Satoshi's genesis address
                    txId: "368dc2eba45bcbaf6533ccf119edf2342aeb4d503cdecfb269049c353b02c1c3",
                    satoshis: 546,
                    outputIndex: 0,
                }, {
                    address: "1JRWop5ZzYCC3NpYzxghFfUcWPJR9kjdoc",
                    txId: "11972719a82c1441ddfbadd1de806e5837391da31868bc38f24d6d30998874c9",
                    satoshis: 546,
                    outputIndex: 45,
                }, {
                    address: "1JRWop5ZzYCC3NpYzxghFfUcWPJR9kjdoc",
                    txId: "6a9ac287ece4eabbe442bf4feadde9a4d9761c7bcdb06ee041d0589bf5e5daba",
                    satoshis: 546,
                    outputIndex: 0,
                },
            ],
            // 手续费：138 stashi
            outputs: [
                {
                    satoshis: 1000,
                    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
                },
                {
                    satoshis: 500,
                    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa", 
                },
                {
                    satoshis: 500,
                    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
                },
            ],
        };
        const rawHex = buildAndSignTx({
            privateKey: "60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e",
            signObj: data,
            network: "mainnet"
        });
        console.log(rawHex);
        expect(rawHex).toBeTruthy();
        expect(rawHex.length).toBeGreaterThan(0);
    });
});

describe('signBtcTaprootTransaction test case', () => {
    test('should sign taproot transaction', async () => {
        // 使用固定的有效私钥
        const privateKey = Buffer.from("60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e", "hex");
        
        const signObj = {
            inputs: [{
                txid: "368dc2eba45bcbaf6533ccf119edf2342aeb4d503cdecfb269049c353b02c1c3",
                amount: 546,
                output: bitcoin.payments.p2tr({
                    internalPubkey: toXOnly(ECPair.fromPrivateKey(privateKey).publicKey),
                    network: bitcoin.networks.bitcoin
                }).output!.toString('hex'),
                publicKey: toXOnly(ECPair.fromPrivateKey(privateKey).publicKey)
            }],
            outputs: [{
                value: 500,
                sendAddress: bitcoin.address.fromOutputScript(
                    bitcoin.payments.p2tr({
                        internalPubkey: toXOnly(ECPair.fromPrivateKey(privateKey).publicKey),
                        network: bitcoin.networks.bitcoin
                    }).output!
                ),
                sendPubKey: ECPair.fromPrivateKey(privateKey).publicKey.toString('hex')
            }]
        };

        const signedTx = signBtcTaprootTransaction({
            privateKey,
            signObj
        });
        console.log(`signBtcTaprootTransaction ${signedTx}`);

        expect(signedTx).toBeTruthy();
        expect(signedTx.length).toBeGreaterThan(0);
    });
});
