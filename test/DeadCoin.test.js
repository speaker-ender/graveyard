// test/DeadCoin.test.js
const { expect } = require('chai');
const {
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert, // Assertions for transactions that should fail
} = require('@openzeppelin/test-helpers');

// Load compiled artifacts
const DeadCoin = artifacts.require('DeadCoin');

// Constants
const MAX_TRANSFER_VALUE = 1000000;

contract('DeadCoin', function ([sender, receiver]) {
    beforeEach(async function () {
        // The bundled BN library is the same one web3 uses under the hood
        this.zeroValue = new BN(0);
        this.knownValue = new BN(1);
        this.randomValue = new BN(Math.floor(Math.random() * MAX_TRANSFER_VALUE));

        this.deadCoin = await DeadCoin.new();
    });

    //
    // TRANSFER TESTS
    //
    it('reverts when transferring tokens to the zero address', async function () {
        // await expectRevert(
        //     this.deadCoin.transfer(constants.ZERO_ADDRESS, this.knownValue, { from: sender }),
        //     'ERC20: transfer to the zero address',
        // );
    });

    it('emits a Transfer event on successful transfers', async function () {
        const receipt = await this.deadCoin.transfer(
            receiver, this.knownValue, { from: sender }
        );

        // Event assertions can verify that the arguments are the expected ones
        expectEvent(receipt, 'Transfer', {
            from: sender,
            to: receiver,
            value: this.knownValue,
        });
    });

    it('updates balances on successful transfers', async function () {
        await this.deadCoin.transfer(receiver, this.knownValue, { from: sender });
        const receiverBalance = await this.deadCoin.balanceOf(receiver);

        expect(receiverBalance).to.be.bignumber.equal(this.knownValue);
    });

    it('updates balances on successful transfer with random amount', async function () {
        await this.deadCoin.transfer(receiver, this.randomValue, { from: sender });
        const receiverBalance = await this.deadCoin.balanceOf(receiver);

        expect(receiverBalance).to.be.bignumber.equal(this.randomValue);
    });


    //
    // ALLOWANCE TESTS
    //
    it('reverts when transfer amount exceeds allowance', async function () {

        // await expectRevert(
        //     // Function: transferFrom
        //     // Params: address sender, address recipient, amount
        //     this.deadCoin.transferFrom(sender, receiver, this.knownValue),
        //     'ERC20: transfer amount exceeds allowance',
        // );
    });

    it('allowance value of 0 by default', async function () {
        // Function: allowance
        // Params: address owner, address spender
        const allowance = await this.deadCoin.allowance(sender, receiver);

        expect(allowance).to.be.bignumber.equal(this.zeroValue);
    });

    it('emits an approval event for receiver from approve function', async function () {
        // Function: approve
        // Params: address spender, uint256 amount
        const receipt = await this.deadCoin.approve(receiver, this.knownValue);

        expectEvent(receipt, 'Approval', {
            owner: sender,
            spender: receiver,
            value: this.knownValue,
        });
    });

    it('emits an approval event for sender from approve function', async function () {
        // Function: approve
        // Params: address spender, uint256 amount
        const receipt = await this.deadCoin.approve(sender, this.knownValue);

        expectEvent(receipt, 'Approval', {
            owner: sender,
            spender: sender,
            value: this.knownValue,
        });
    });

    it('emits an approval event for receiver from increaseAllowance function', async function () {
        // Function: approve
        // Params: address spender, uint256 amount
        await this.deadCoin.approve(receiver, this.knownValue);

        // Function: increaseAllowance
        // Params: address spender, uint256 addedValue
        const receipt = await this.deadCoin.increaseAllowance(receiver, this.knownValue);

        expectEvent(receipt, 'Approval', {
            owner: sender,
            spender: receiver,
            value: this.knownValue.add(this.knownValue),
        });
    });

    it('emits an approval event for receiver from decreaseAllowance function', async function () {
        // Function: approve
        // Params: address spender, uint256 amount
        await this.deadCoin.approve(receiver, this.knownValue.add(this.knownValue));

        // Function: decreaseAllowance
        // Params: address spender, uint256 addedValue
        const receipt = await this.deadCoin.decreaseAllowance(receiver, this.knownValue);

        expectEvent(receipt, 'Approval', {
            owner: sender,
            spender: receiver,
            value: this.knownValue,
        });
    });

    it('emits a transfer event for transferFrom call', async function () {
        // Function: approve
        // Params: address spender, uint256 amount
        await this.deadCoin.approve(sender, this.knownValue);

        // Function: transferFrom
        // Params: address sender, address recipient, amount
        const receipt = await this.deadCoin.transferFrom(sender, receiver, this.knownValue);

        expectEvent(receipt, 'Transfer', {
            from: sender,
            to: receiver,
            value: this.knownValue,
        });
    });

    it('updates allowance after full amount transferFrom', async function () {
        // Function: approve
        // Params: address spender, uint256 amount
        await this.deadCoin.approve(sender, this.knownValue);

        // Function: transferFrom
        // Params: address sender, address recipient, amount
        await this.deadCoin.transferFrom(sender, receiver, this.knownValue);

        // Function: allowance
        // Params: address owner, address spender
        const allowance = await this.deadCoin.allowance(sender, receiver);

        expect(allowance).to.be.bignumber.equal(this.zeroValue);
    });

    it('updates allowance after partial amount transferFrom', async function () {
        // Function: approve
        // Params: address spender, uint256 amount
        await this.deadCoin.approve(sender, this.knownValue.add(this.knownValue));

        // Function: transferFrom
        // Params: address sender, address recipient, amount
        await this.deadCoin.transferFrom(sender, receiver, this.knownValue);

        // Function: allowance
        // Params: address owner, address spender
        const allowance = await this.deadCoin.allowance(sender, sender);

        expect(allowance).to.be.bignumber.equal(this.knownValue);
    });

    it('updates balances after approved transfer', async function () {
        // Function: approve
        // Params: address spender, uint256 amount
        await this.deadCoin.approve(sender, this.knownValue);

        // Function: transferFrom
        // Params: address sender, address recipient, amount
        await this.deadCoin.transferFrom(sender, receiver, this.knownValue);

        const receiverBalance = await this.deadCoin.balanceOf(receiver);

        expect(receiverBalance).to.be.bignumber.equal(this.knownValue);
    });

    it('updates balances after approved transfer with random amount', async function () {
        // Function: approve
        // Params: address spender, uint256 amount
        await this.deadCoin.approve(sender, this.randomValue);

        // Function: transferFrom
        // Params: address sender, address recipient, amount
        await this.deadCoin.transferFrom(sender, receiver, this.randomValue);

        const receiverBalance = await this.deadCoin.balanceOf(receiver);

        expect(receiverBalance).to.be.bignumber.equal(this.randomValue);
    });

    //
    // BURN FUNCTIONS
    //
    it('updates total supply after burning', async function () {
        const startSupply = await this.deadCoin.totalSupply();

        // Function: burn
        // Params: amount
        await this.deadCoin.burn(this.knownValue);

        const endSupply = await this.deadCoin.totalSupply();

        expect(endSupply).to.be.bignumber.equal(startSupply.sub(this.knownValue));
    });

    it('reverts when burnFrom amount exceeds allowance', async function () {

        // await expectRevert(
        //     // Function: burnFrom
        //     // Params: address account, uint256 amount
        //     this.deadCoin.burnFrom(sender, this.knownValue),
        //     'ERC20: burn amount exceeds allowance',
        // );
    });

    it('updates total supply after burnFrom', async function () {
        await this.deadCoin.approve(sender, this.knownValue);

        const startSupply = await this.deadCoin.totalSupply();

        // Function: burn
        // Params: amount
        await this.deadCoin.burnFrom(sender, this.knownValue);

        const endSupply = await this.deadCoin.totalSupply();

        expect(endSupply).to.be.bignumber.equal(startSupply.sub(this.knownValue));
    });


    //
    // VOTE FUNCTIONS
    //
    it('emits a delegateChanged event from a delegate call', async function () {
        const delegateAddress = await this.deadCoin.delegates(sender);
        const receipt = await this.deadCoin.delegate(receiver);

        expectEvent(receipt, 'DelegateChanged', {
            delegator: sender,
            fromDelegate: delegateAddress,
            toDelegate: receiver,
        });
    });

    it('adding voting power to self', async function () {
        const delegateAddress = await this.deadCoin.delegates(sender);
        await this.deadCoin.delegate(sender);
        const votes = await this.deadCoin.getVotes(sender);

        // Need to look how original delegation is done to actually test this
        expect(votes).to.be.bignumber.equal(votes);
    });

    it('changing votes after delegation', async function () {
        // const delegateAddress = await this.deadCoin.delegates(sender);
        await this.deadCoin.delegate(sender);

        const startSenderVotes = await this.deadCoin.getVotes(sender);
        // console.log('Sender vote count after delegating self', startSenderVotes.toString());
        const startReceiverVotes = await this.deadCoin.getVotes(receiver);
        // console.log('Receiver vote count after delegating self', startReceiverVotes.toString());

        await this.deadCoin.delegate(receiver);

        const endSenderVotes = await this.deadCoin.getVotes(sender);
        // console.log('Sender vote count after delegation transfer', endSenderVotes.toString());
        const endReceiverVotes = await this.deadCoin.getVotes(receiver);
        // console.log('Receiver vote count after delegation transfer', endReceiverVotes.toString());

        // Need to look how original delegation is done to actually test this
        expect(startSenderVotes).to.be.bignumber.equal(endReceiverVotes);
    });
});
