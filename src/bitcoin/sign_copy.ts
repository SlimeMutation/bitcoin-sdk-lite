import { Transaction } from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import * as bitcoin from 'bitcoinjs-lib';
import BIP32Factory from 'bip32';
BIP32Factory(ecc);
const bitcore = require("bitcore-lib");
import { toXOnly, tapTreeToList, tapTreeFromList } from "bitcoinjs-lib/src/psbt/bip371"
import { ECPairFactory } from 'ecpair'

bitcoin.initEccLib(ecc);
const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

export function buildAndSignTx(params: {
  privateKey: string;
  signObj: any;
  network: string;
}): string {
  const { privateKey, signObj, network } = params;
  const net = bitcore.Networks[network];
  const inputs = signObj.inputs.map((input: {
    address: string;
    txId: string;
    outputIndex: number;
    satoshis: number;
  }) => {
    return {
      address: input.address,
      txId: input.txId,
      outputIndex: input.outputIndex,
      script: new bitcore.Script.fromAddress(input.address).toHex(),
      satoshis: input.satoshis
    }
  });
  const outputs = signObj.outputs.map((output: {
    address: string;
    satoshis: number;
  }) => {
    return {
      address: output.address,
      satoshis: output.satoshis
    }
  });
  const transaction = new bitcore.Transaction(net).from(inputs).to(outputs);
  transaction.version = 2;
  transaction.sign(privateKey);
  return transaction.toString();
}

// export function buildUnsignTxAndSign(params:{
//   keyPair: any;
//   signObj: {
//     inputs: {
//       address: string;
//       txId: string;
//       outputIndex: number;
//       satoshis: number;
//     }[];
//     outputs: {
//       address: string;
//       satoshis: number;
//     }[];
//   };
//   network: string;
// }): string {
//   const {keyPair, signObj, network} = params;
//   const psbt = new bitcoin.Psbt({ network });
//   const inputs = signObj.inputs.map((input) => {
//     return {
//       address: input.address,
//       txId: input.txId,
//       outputIndex: input.outputIndex,
//       script: new bitcore.Script.fromAddress(input.address).toHex(),
//       satoshis: input.satoshis
//     }
//   });
//   psbt.addInput(inputs);

//   const outputs = signObj.outputs.map((output) => {
//     return {
//       address: output.address,
//       satoshis: output.satoshis
//     }
//   });
//   psbt.addOutput(outputs);
//   psbt.toBase64();

//   psbt.signInput(0, keyPair);
//   psbt.finalizeAllInputs();

//   const signedTransaction = psbt.extractTransaction().toHex();
//   return signedTransaction;
// }

export function signBtcTaprootTransaction(params:{
  privateKey: Buffer;
  signObj: {
    inputs: {
      txid: string;
      amount: number;
      output: string;
      publicKey: Buffer;
    }[];
    outputs: {
      value: number;
      sendAddress: string;
      sendPubKey: string;
    }[];
  };
}): string {
  const {privateKey, signObj} = params;
  const psbt = new bitcoin.Psbt({ network: bitcoin.networks.bitcoin });
  const inputs = signObj.inputs.map((input) => {
    return {
      hash: input.txid,
      index: 0,
      witnessUtxo: {value: input.amount, script: Buffer.from(input.output, 'hex')},
      tapInternalKey: toXOnly(input.publicKey)
    }
  });
  psbt.addInputs(inputs);

  const sendInternalKey = ECPair.fromPrivateKey(privateKey, { compressed: false });

  const outputs = signObj.outputs.map((output) => {
    return {
      value: output.value,
      address: output.sendAddress!,
      tapInternalKey: toXOnly(Buffer.from(output.sendPubKey, 'hex'))
    }
  });
  psbt.addOutputs(outputs);
  
  const tweakedSigner = sendInternalKey.tweak(
    bitcoin.crypto.taggedHash('TapTweak', toXOnly(sendInternalKey.publicKey))
  );

  psbt.signInput(0, tweakedSigner);
  psbt.finalizeAllInputs();

  return psbt.extractTransaction().toBuffer().toString('hex');
}
