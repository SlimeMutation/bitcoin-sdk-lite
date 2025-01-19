import { buildAndSignTx, buildUnsignTxAndSign } from "../src/bitcoin/sign_copy";
import * as bitcoin from "bitcoinjs-lib";
import { ECPairFactory } from 'ecpair';
import * as ecc from 'tiny-secp256k1';

/*
{
    "notice": "",
    "unspent_outputs": [
        {
            "tx_hash_big_endian": "c3c1023b359c0469b2cfde3c504deb2a34f2ed19f1cc3365afcb5ba4ebc28d36",
            "tx_hash": "368dc2eba45bcbaf6533ccf119edf2342aeb4d503cdecfb269049c353b02c1c3",
            "tx_output_n": 0,
            "script": "76a914bf1d00cc75bf99260d637f9d56e8155285ab581288ac",
            "value": 546,
            "value_hex": "0222",
            "confirmations": 0,
            "tx_index": 1919439632370553
        },
        {
            "tx_hash_big_endian": "c9748899306d4df238bc6818a31d3937586e80ded1adfbdd41142ca819279711",
            "tx_hash": "11972719a82c1441ddfbadd1de806e5837391da31868bc38f24d6d30998874c9",
            "tx_output_n": 45,
            "script": "76a914bf1d00cc75bf99260d637f9d56e8155285ab581288ac",
            "value": 546,
            "value_hex": "0222",
            "confirmations": 156,
            "tx_index": 618908599256450
        },
        {
            "tx_hash_big_endian": "badae5f59b58d041e06eb0cd7b1c76d9a4e9ddea4fbf42e4bbeae4ec87c29a6a",
            "tx_hash": "6a9ac287ece4eabbe442bf4feadde9a4d9761c7bcdb06ee041d0589bf5e5daba",
            "tx_output_n": 0,
            "script": "76a914bf1d00cc75bf99260d637f9d56e8155285ab581288ac",
            "value": 546,
            "value_hex": "0222",
            "confirmations": 3900,
            "tx_index": 3750813478263965
        }
    ]
}
 */
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

describe('buildUnsignTxAndSign test case', () => {
    test('offline sign unsigned tx', async () => {
        const unsignedTx = {
            inputs: [
                {
                    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
                    txId: "368dc2eba45bcbaf6533ccf119edf2342aeb4d503cdecfb269049c353b02c1c3",
                    satoshis: 546,
                    outputIndex: 0,
                    txHex: "02000000000101c3c1023b359c0469b2cfde3c504deb2a34f2ed19f1cc3365afcb5ba4ebc28d36000000001716001462e907b15cbf27d5425399ebf6f0fb50ebb88f18ffffffff01e8030000000000001976a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac0247304402207f2d5e1f5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e02205e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e0121025e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e5e00000000"
                }
            ],
            outputs: [
                {
                    satoshis: 500,
                    address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
                }
            ],
        };

        const keyPair = ECPairFactory(ecc).fromPrivateKey(
            Buffer.from("60164bec9512d004af7f71e7ed868c8e9ac2cc6234d8b682037ec80547595f2e", "hex")
        );
        
        const signedTx = buildUnsignTxAndSign({
            keyPair: keyPair,
            signObj: unsignedTx,
            network: "mainnet"
        });

        expect(signedTx).toBeTruthy();
        expect(signedTx.length).toBeGreaterThan(0);
    });
});
