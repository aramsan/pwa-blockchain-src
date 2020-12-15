import Web3 from 'web3'
import artifacts from "~~/build/contracts/SingleNumRegister.json"

export default async function (context, inject) {
    let web3

    if (
        typeof window !== 'undefined' &&
        typeof window.ethereum !== 'undefined'
    ) {
        web3 = new Web3(window.ethereum)
        window.ethereum.enable().catch((error) => {
            // User denied account access
            console.log(error)
        })
    } else if (
        typeof window !== 'undefined' &&
        typeof window.web3 !== 'undefined'
    ) {
        web3 = new Web3(window.web3.currentProvider)
    } else {
        const httpEndpoint = 'http://127.0.0.1:7545'
        web3 = new Web3(new Web3.providers.HttpProvider(httpEndpoint))
    }

    let networkId = await web3.eth.net.getId()// チェーンのネットワークIDを取得
    let contract = new web3.eth.Contract( //コントラクトのインスタンスの初期化。設定ファイルと、アドレスが必要
        artifacts.abi, // コントラクトのコンパイル後の設定ファイル
        artifacts.networks[networkId].address // ネットワークIDごとに保存されているコントラクトのアドレスを読み込む
    )

    inject('web3', web3)
    inject('contract',contract) // インスタンスを生やす

}