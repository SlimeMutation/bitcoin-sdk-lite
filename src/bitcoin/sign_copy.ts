import { Transaction } from 'bitcoinjs-lib';
const ecc = require("tiny-secp256k1");
const { BIP32Factory } = require("bip32");
BIP32Factory(ecc);
const bitcoin = require("bitcoinjs-lib");
const bitcore = require("bitcore-lib");

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

export function buildUnsignTxAndSign(params:{
  keyPair: any;
  signObj: {
    inputs: {
      address: string;
      txId: string;
      outputIndex: number;
      satoshis: number;
    }[];
    outputs: {
      address: string;
      satoshis: number;
    }[];
  };
  network: string;
}): string {
  const {keyPair, signObj, network} = params;
  const psbt = new bitcoin.Psbt({ network });
  const inputs = signObj.inputs.map((input) => {
    return {
      address: input.address,
      txId: input.txId,
      outputIndex: input.outputIndex,
      script: new bitcore.Script.fromAddress(input.address).toHex(),
      satoshis: input.satoshis
    }
  });
  psbt.addInput(inputs);

  const outputs = signObj.outputs.map((output) => {
    return {
      address: output.address,
      satoshis: output.satoshis
    }
  });
  psbt.addOutput(outputs);
  psbt.toBase64();

  psbt.signInput(0, keyPair);
  psbt.finalizeAllInputs();

  const signedTransaction = psbt.extractTransaction().toHex();
  return signedTransaction;
}
