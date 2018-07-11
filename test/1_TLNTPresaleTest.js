const TLNTToken = artifacts.require("TLNTToken");
const TLNTCrowdsale = artifacts.require("TLNTCrowdsale");
const TLNTPresale = artifacts.require("TLNTPresale");
const TLNTWhitelist = artifacts.require("TLNTWhitelist");

contract('TLNTPresale', (accounts) => {
    it("presale whitelist", async () => {
        const whitelist = await TLNTWhitelist.deployed();
        await whitelist.setManager(accounts[0], true);
        await whitelist.updateWhitelist(accounts[1], 1, {from:accounts[0]});
        await whitelist.updateWhitelist(accounts[2], 2, {from:accounts[0]});
    });

    it("presale buy 1000 tokens", async () => {
        const presale = await TLNTPresale.deployed();
        const token = await TLNTToken.deployed();

        // 1000000000000000000000/22857= 43 750 273 439 208 995
        await presale.sendTransaction({value:web3.toWei(0.043750273439208995, 'ether'), from: accounts[1]});
        const balance = await token.balanceOf.call(accounts[1]);
        assert.equal(balance.toNumber(), web3.toWei(1000, 'ether'), "have bought 1000 tokens");
    });

    it("only crowdsale whitelisted", async () => {
        const presale = await TLNTPresale.deployed();

        try {
            await presale.sendTransaction({value:web3.toWei(0.1, 'ether'), from: accounts[2]});
        }catch(e){
            //expected throw
            return;
        }
        assert.fail('Expected throw not received');
    });

    it("not whitelisted", async () => {
        const presale = await TLNTPresale.deployed();

        try {
            await presale.sendTransaction({value:web3.toWei(0.1, 'ether'), from: accounts[3]});
        }catch(e){
            //expected throw
            return;
        }
        assert.fail('Expected throw not received');
    });

    it("finalize presale", async () => {
        const presale = await TLNTPresale.deployed();
        const crowdsale = await TLNTCrowdsale.deployed();
        const token = await TLNTToken.deployed();
        await presale.finalize();
        assert.equal((await token.balanceOf.call(presale.address)).toNumber(), 0, "have transfered all tokens");
        assert.notEqual((await token.balanceOf.call(crowdsale.address)).toNumber(), 0, "have transfered all tokens");
    });
});