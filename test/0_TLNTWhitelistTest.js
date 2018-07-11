const TLNTWhitelist = artifacts.require("TLNTWhitelist");

contract('TLNTWhitelist', (accounts) => {

    it("whitelist can not update", async () => {
        const whitelist = await TLNTWhitelist.deployed();

        try {
            assert.equal(await whitelist.updateWhitelist(accounts[1], 1), false, "reject non manager whitelist");
        }catch(e){
            //expected throw
            return;
        }
        assert.fail('Expected throw not received');
    });

    it("whitelist can update", async() => {
        const whitelist = await TLNTWhitelist.deployed();
        await whitelist.setManager(accounts[0], true);
        assert.equal(await whitelist.isManager.call(accounts[0]), true, "manager is on whitelist");

        //should not throw an error, that's all
        await whitelist.updateWhitelist(accounts[1], 1, {from:accounts[0]});
        await whitelist.updateWhitelist(accounts[2], 2, {from:accounts[0]});

        //check if accounts have been whitelisted successfully
        assert.equal(await whitelist.isWhiteListed.call(accounts[1]), 1, "account 1 whitelisted 1");
        assert.equal(await whitelist.isWhiteListed.call(accounts[2]), 2, "account 2 whitelisted 2");
    });
});