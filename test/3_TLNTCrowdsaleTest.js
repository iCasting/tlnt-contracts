const TLNTToken = artifacts.require("TLNTToken");
const TLNTCrowdsale = artifacts.require("TLNTCrowdsale");
const TLNTWhitelist = artifacts.require("TLNTWhitelist");
const Settings = require("../Settings");

contract('TLNTCrowdsale', function(accounts) {

    it("crowdsale whitelist", async () => {
        const whitelist = await TLNTWhitelist.deployed();
        await whitelist.setManager(accounts[0], true);
        await whitelist.updateWhitelist(accounts[1], 1, {from:accounts[0]});
        await whitelist.updateWhitelist(accounts[2], 2, {from:accounts[0]});
        await whitelist.updateWhitelist(accounts[3], 1, {from:accounts[0]});
        await whitelist.updateWhitelist(accounts[4], 2, {from:accounts[0]});
    });

    it("crowdsale buy tokens", async () => {
        const crowdsale = await TLNTCrowdsale.deployed();
        const token = await TLNTToken.deployed();

        const buy = [
            {
                amount:   Settings.cap/5,
                expected: Settings.cap/5*Settings.tokenPrice*1.5
            },
            {
                amount:   Settings.cap/5,
                expected: Settings.cap/5*Settings.tokenPrice*1.4
            },
            {
                amount:   Settings.cap/10,
                expected: Settings.cap/10*Settings.tokenPrice*1.3
            },
            {
                amount:   Settings.cap/5,
                expected: Settings.cap/5*Settings.tokenPrice*1.25
            }
        ];

        for(var key in buy) {
            await crowdsale.sendTransaction({
                value: web3.toWei(buy[key].amount, 'ether'),
                from: accounts[parseInt(key)+1]
            });
            const balance = await token.balanceOf.call(accounts[parseInt(key)+1]);
            assert.equal(balance.toNumber(), web3.toWei(buy[key].expected, 'ether'), "have bought 3000 tokens");
        }

    });

    it("not whitelisted", async () => {
        const crowdsale = await TLNTCrowdsale.deployed();

        try {
            await crowdsale.sendTransaction({value:web3.toWei(0.1, 'ether'), from: accounts[9]});
        }catch(e){
            //expected throw
            return;
        }
        assert.fail('Expected throw not received');
    });
});