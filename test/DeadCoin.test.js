
// test/DeadCoin.test.js
// Load dependencies
const { expect } = require('chai');

// Import utilities from Test Helpers
const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
    balance
} = require('@openzeppelin/test-helpers');

// // Load compiled artifacts
const DeadCoin = artifacts.require('DeadCoin');

contract('DeadCoin', function ([sender, receiver]) {
    beforeEach(async function () {
        // The bundled BN library is the same one web3 uses under the hood
        this.value = new BN(1);

        this.deadCoin = await DeadCoin.new();
    });

    it('reverts when transferring tokens to the zero address', async function () {
        // Conditions that trigger a require statement can be precisely tested
        await expectRevert(
            this.deadCoin.transfer(constants.ZERO_ADDRESS, this.value, { from: sender }),
            'ERC20: transfer to the zero address',
        );
    });

    it('emits a Transfer event on successful transfers', async function () {
        const receipt = await this.deadCoin.transfer(
            receiver, this.value, { from: sender }
        );

        // Event assertions can verify that the arguments are the expected ones
        expectEvent(receipt, 'Transfer', {
            from: sender,
            to: receiver,
            value: this.value,
        });
    });

    it('updates balances on successful transfers', async function () {
        const receipt = await this.deadCoin.transfer(receiver, this.value, { from: sender });
        const receiverBalance = await this.deadCoin.balanceOf(receiver);

        // BN assertions are automatically available via chai-bn (if using Chai)
        expect(receiverBalance).to.be.bignumber.equal(this.value);
    });
});
