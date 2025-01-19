import * as bip39 from 'bip39'

describe('Test for bip39', () => {
    test('test', async () => {
        //生成助记词
        const mnemonic = bip39.generateMnemonic(128, undefined, bip39.wordlists.chinese_simplified);
        console.log('助记词-128-12：', mnemonic);
        console.log('助记词-160-15：', bip39.generateMnemonic(160, undefined, bip39.wordlists.chinese_simplified));
        console.log('助记词-192-18：', bip39.generateMnemonic(192, undefined, bip39.wordlists.chinese_simplified));
        console.log('助记词-224-21：', bip39.generateMnemonic(224, undefined, bip39.wordlists.chinese_simplified));
        console.log('助记词-256-24：', bip39.generateMnemonic(256, undefined, bip39.wordlists.chinese_simplified));
        console.log('助记词-256-24：', bip39.generateMnemonic(256, undefined, bip39.wordlists.english));
        //助记词编码
        const entropy = bip39.mnemonicToEntropy(mnemonic, bip39.wordlists.chinese_simplified);
        console.log("entropy:", entropy)
        //助记词解码
        const decodeMnemonic = bip39.entropyToMnemonic(entropy, bip39.wordlists.chinese_simplified);
        console.log("decodeMnemonic:", decodeMnemonic);
        //校验助记词
        const checkResult = bip39.validateMnemonic("冯 共 怀 民 张 剂 普 届 盾 摆 翻 惜1", bip39.wordlists.chinese_simplified);
        console.log("checkResult:", checkResult);
        //助记词异步转seed
        bip39.mnemonicToSeed(mnemonic, '').then((seed) => console.log("seed async2:", seed));
        const seedAsync = await bip39.mnemonicToSeed(mnemonic, '')
        console.log("seed async1:", seedAsync)
        //助记词同步转seed
        const seed = bip39.mnemonicToSeedSync(mnemonic, '');
        console.log("seed sync:", seed)
    });
});
