const TLNTToken = artifacts.require("TLNTToken");
const TLNTTokenTimelock = artifacts.require("TLNTTokenTimelock");
const sleep = require("await-sleep");

contract('TLNTCrowdsale', function(accounts) {


    it("not available yet", async () => {

        const timelock = await TLNTTokenTimelock.deployed();

        try {
            await timelock.release();
        }catch(e){
            //expected throw
            return;
        }
        assert.fail('Expected throw not received');
    });

    it("vesting tokens released", async () => {
        await sleep(10000);
        const timelock = await TLNTTokenTimelock.deployed();
        const token = await TLNTToken.deployed();

        await timelock.release();
        const balance = await token.balanceOf.call(accounts[8]);
        assert.equal(balance, web3.toWei(10, 'ether'), "have released 10 tokens");
    });
});