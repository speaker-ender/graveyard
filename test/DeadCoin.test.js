
// test/DeadCoin.test.js
// Load dependencies
const { expect } = require('chai');

// Import utilities from Test Helpers
const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
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
        this.deadCoin.transfer(receiver, this.value, { from: sender });
        // BN assertions are automatically available via chai-bn (if using Chai)
        const senderBalance = await this.deadCoin.balanceOf(sender);
        const receiverBalance = await this.deadCoin.balanceOf(receiver);

        console.log(senderBalance);
        console.log(receiverBalance);
        expect(receiverBalance).to.be.bignumber.equal(this.value);
    });
});

// Start test block
// contract('DeadCoin', function ([owner, other]) {
//     // Use large integers ('big numbers')
//     const value = new BN('42');

//     beforeEach(async function () {
//         this.deadCoin = await DeadCoin.new({ from: owner });
//     });

//     it('retrieve returns a value previously stored', async function () {
//         await this.deadCoin.store(value, { from: owner });

//         // Use large integer comparisons
//         expect(await this.deadCoin.retrieve()).to.be.bignumber.equal(value);
//     });

//     it('store emits an event', async function () {
//         const receipt = await this.deadCoin.store(value, { from: owner });

//         // Test that a ValueChanged event was emitted with the new value
//         expectEvent(receipt, 'ValueChanged', { value: value });
//     });

//     it('non owner cannot store a value', async function () {
//         // Test a transaction reverts
//         await expectRevert(
//             this.deadCoin.store(value, { from: other }),
//             'Ownable: caller is not the owner',
//         );
//     })
// });

// // Start test block
// contract('DeadCoin', function () {
//     beforeEach(async function () {
//         // Deploy a new DeadCoin contract for each test
//         this.deadCoin = await DeadCoin.new();
//     });

//     // Test case
//     it('retrieve returns a value previously stored', async function () {
//         // Store a value
//         await this.deadCoin.store(42);

//         // Test if the returned value is the same one
//         // Note that we need to use strings to compare the 256 bit integers
//         expect((await this.deadCoin.retrieve()).toString()).to.equal('42');
//     });
// });
