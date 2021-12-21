// migrations/2_deploy.js
const DeadCoin = artifacts.require('DeadCoin');

module.exports = async function (deployer) {
    await deployer.deploy(DeadCoin);
};
