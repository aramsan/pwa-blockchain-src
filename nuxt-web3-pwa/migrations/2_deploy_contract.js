const SingleNumRegister = artifacts.require('SingleNumRegister')

module.exports = function (deployer) {
    deployer.deploy(SingleNumRegister)
}