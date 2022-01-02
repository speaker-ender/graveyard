// scripts/index.js
module.exports = async function main(callback) {
    try {

        // Retrieve accounts from the local node
        // const accounts = await web3.eth.getAccounts();
        // console.log(accounts)

        // Set up a Truffle contract, representing our deployed Box instance
        const DeadCoin = artifacts.require('DeadCoin');
        const deadCoin = await DeadCoin.deployed();
        console.log(deadCoin);

        const receipt = await this.deadCoin.transfer(constants.ZERO_ADDRESS, this.knownValue, { from: sender });

        // Send a transaction to store() a new value in the Box
        // await deadCoin.store(23);

        // Call the retrieve() function of the deployed Box contract
        // const value = await deadCoin.retrieve();
        // console.log('DeadCoin value is', value.toString());

        callback(0);
    } catch (error) {
        console.error(error);
        callback(1);
    }
};
