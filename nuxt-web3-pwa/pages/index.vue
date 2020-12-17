<template>
    <div class="container">
        <div>
            <Logo />
            <h1 class="title">nuxt-web3-pwa</h1>
            <div class="links" v-if="!isSignedIn">
                <button @click="signIn()">Sign In</button>
            </div>

            <div class="links" v-if="isSignedIn">
                <!-- ←ここも少し変えています。 -->
                <input
                    type="text"
                    v-model="inputNumber"
                    placeholder="input number"
                />
                <button @click="setNumber()">Set Number to contract</button>
            </div>
            <div class="links">
                <button @click="getNumber()">Get Number from contract</button>
            </div>
            <div>Number:{{ number }}</div>
        </div>
    </div>
</template>

<script>
import toContract from "~/plugins/toContract.js";
import firebase from "firebase";
import sha256 from "js-sha256";
export default {
    data() {
        return {
            number: 0, // コントラクトから取得する数値
            inputNumber: 0, // フォームから入力された数値
            isSignedIn: false, // ←ここを追加
            pk: "", //秘密鍵
            address: "", //アドレス
        };
    },
    methods: {
        getNumber: async function () {
            let ret = await this.$contract.methods.get().call(); // コントラクトからの読み込み部分
            this.number = ret; // フロントへ反映
        },
        setNumber: async function () {
            const functionAbi = await this.$contract.methods
                .set(this.inputNumber) // 呼び出す関数と引数の設定
                .encodeABI();

            let result = await toContract(
                // toContract の呼び出し
                this,
                this.address,
                this.privateKey,
                functionAbi
            );
        },
        signIn: function () {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider);
        },
    },
    mounted() {
        if (!firebase.apps.length) {
            var firebaseConfig = {
                apiKey: process.env.APIKEY,
                authDomain: process.env.AUTHDOMAIN,
            };
            // Initialize Firebase
            firebase.initializeApp(firebaseConfig);
        }
        var self = this;
        firebase
            .auth()
            .getRedirectResult()
            .then(function (result) {
                if (result.credential) {
                    let user = result.user;
                    self.isSignedIn = true;
                    console.log(user.uid);
                    //ここから追加
                    self.privateKey = "0x" + sha256.hex(user.uid);
                    self.address = self.$web3.eth.accounts.privateKeyToAccount(
                        self.privateKey
                    ).address;
                    self.$web3.eth.defaultAccount = self.address;
                    console.log("Address:" + self.address);
                    //ここまで追加
                }
            })
            .catch(function (error) {
                let errorMessage = error.message;
                console.log(errorMessage);
            });
        console.log("Current Block Number");
        this.$web3.eth.getBlockNumber().then(console.log);
    },
};
</script>

<style>
.container {
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.title {
    font-family: "Quicksand", "Source Sans Pro", -apple-system,
        BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial,
        sans-serif;
    display: block;
    font-weight: 300;
    font-size: 100px;
    color: #35495e;
    letter-spacing: 1px;
}

.subtitle {
    font-weight: 300;
    font-size: 42px;
    color: #526488;
    word-spacing: 5px;
    padding-bottom: 15px;
}

.links {
    padding-top: 15px;
}
</style>
