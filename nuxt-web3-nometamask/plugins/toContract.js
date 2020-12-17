import Common from "ethereumjs-common";

export default async function(app, address, pk, functionAbi) {
  const EthereumTx = require("ethereumjs-tx").Transaction;
  const netid = await app.$web3.eth.net.getId();
  var details = await { // 書き込み時のパラメーター
    nonce: 0, // 仮置きの値です。後で書き換えます。
    gasPrice: 0, // Gas代はゼロにします。
    gasLimit: 8000000, // 最大値に設定してあります
    from: address, // 署名する人です
    to: app.$contract.options.address, // 書き込み先のコントラクトのアドレスです。
    data: functionAbi // コントラクトの詳細データです
  };
  const customCommon = Common.forCustomChain( // 接続するチェーンンの情報です。
    "mainnet",
    {
      name: "privatechain",
      networkId: netid,
      chainId: netid
    },
    "petersburg"
  );

  await app.$web3.eth.getTransactionCount(address, async function(err, nonce) {
    details.nonce = nonce; // チェーンから最新の書き込み数を取得します。ビットコインのナンスとは違い、1ユーザーが同一コントラクトへ書き込みをした回数がnonceとして取り扱われます。
    const transaction = await new EthereumTx(details, { common: customCommon });
    console.log(transaction);
    transaction.sign(Buffer.from(pk.slice(2), "hex")); // 秘密鍵の頭2バイト"0x"を取り除いて16進数として扱って署名します。
    var rawdata = (await "0x") + transaction.serialize().toString("hex");
    await app.$web3.eth // 署名済みのデータをチェーンに書き込みます。
      .sendSignedTransaction(rawdata)
      .on("transactionHash", function(hash) {
        console.log(["transferToStaging Trx Hash:" + hash]);
      })
      .on("receipt", async function(receipt) {
        console.log(["transferToStaging Receipt:", receipt]);
      })
      .on("error", function(error) {
        console.log(error);
      });
  });
}