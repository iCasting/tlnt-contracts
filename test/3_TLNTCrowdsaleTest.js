const TLNTToken = artifacts.require("TLNTToken");
const TLNTCrowdsale = artifacts.require("TLNTCrowdsale");
const TLNTWhitelist = artifacts.require("TLNTWhitelist");

contract('TLNTCrowdsale', function(accounts) {

    it("crowdsale whitelist", async () => {
        const whitelist = await TLNTWhitelist.deployed();
        await whitelist.setManager(accounts[0], true);
        await whitelist.updateWhitelist(accounts[1], 1, {from:accounts[0]});
        await whitelist.updateWhitelist(accounts[2], 2, {from:accounts[0]});
    });

    it("crowdsale buy 1000 tokens", async () => {
        const crowdsale = await TLNTCrowdsale.deployed();
        const token = await TLNTToken.deployed();

        // 1000000000000000000000/86206= 43 750 273 439 208 995
        await crowdsale.sendTransaction({value:web3.toWei(0.043750273439208995, 'ether'), from: accounts[1]});
        const balance = await token.balanceOf.call(accounts[1]);
        assert.equal(balance.toNumber(), web3.toWei(1000, 'ether'), "have bought 1000 tokens");

        //await crowdsale.sendTransaction({value:web3.toWei(437.50273439208995, 'ether'), from: accounts[2]});
        //assert.equal(balance.toNumber(), web3.toWei(10001000, 'ether'), "have bought 10 000 000 tokens");
    });

    it("only crowdsale whitelisted", async () => {
        const crowdsale = await TLNTCrowdsale.deployed();
        const token = await TLNTToken.deployed();

        await crowdsale.sendTransaction({value:web3.toWei(0.043750273439208995, 'ether'), from: accounts[2]});
        const balance = await token.balanceOf.call(accounts[2]);
        assert.equal(balance.toNumber(), web3.toWei(1000, 'ether'), "have bought 1000 tokens");
    });

    it("not whitelisted", async () => {
        const crowdsale = await TLNTCrowdsale.deployed();

        try {
            await crowdsale.sendTransaction({value:web3.toWei(0.1, 'ether'), from: accounts[3]});
        }catch(e){
            //expected throw
            return;
        }
        assert.fail('Expected throw not received');
    });
});