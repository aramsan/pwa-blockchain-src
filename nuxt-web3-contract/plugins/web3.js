import Web3 from "web3"

export default async function(context, inject) {
  const httpEndpoint = "http://127.0.0.1:7545" //ここを変えればいろんなチェーンに繋げられます
  const web3 = new Web3(new Web3.providers.HttpProvider(httpEndpoint))

    inject('web3',web3)
}