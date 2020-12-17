import Web3 from 'web3'
import artifacts from "~~/build/contracts/SingleNumRegister.json"

export default async function (context, inject) {
    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.PRIVATE)); //←これだけでいい
    
    let networkId = await web3.eth.net.getId()// チェーンのネットワークIDを取得
    let contract = new web3.eth.Contract( //コントラクトのインスタンスの初期化。設定ファイルと、アドレスが必要
        artifacts.abi, // コントラクトのコンパイル後の設定ファイル
        artifacts.networks[networkId].address // ネットワークIDごとに保存されているコントラクトのアドレスを読み込む
    )

    inject('web3', web3)
    inject('contract',contract) // インスタンスを生やす

}