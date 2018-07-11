const TLNTToken = artifacts.require("TLNTToken");
const TLNTCrowdsale = artifacts.require("TLNTCrowdsale");
const TLNTPresale = artifacts.require("TLNTPresale");
const TLNTTimeLock = artifacts.require("TLNTTimeLock");
const TLNTWhitelist = artifacts.require("TLNTWhitelist");

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        try {
            await deployer.deploy(TLNTWhitelist);
            const whitelist = await TLNTWhitelist.deployed();

            await deployer.deploy(TLNTToken);
            const token = await TLNTToken.deployed();

            await deployer.deploy(TLNTTimeLock, '0x68c46d572Fe623A0bC6b1B9603f93F74bCA504eF', new Date().getTime());
            const lock = await TLNTTimeLock.deployed();

            await deployer.deploy(TLNTCrowdsale, lock.address, token.address, whitelist.address);
            const crowdsale = await TLNTCrowdsale.deployed();

            await deployer.deploy(TLNTPresale, lock.address, crowdsale.address, token.address, whitelist.address);
            const presale = await TLNTPresale.deployed();

            // reserve 17.5m tokens for the presale
            await token.mint(presale.address, web3.toWei(17500000, 'ether'));

            // reserve 35m tokens for the crowdsale
            await token.mint(crowdsale.address, web3.toWei(17500000, 'ether'));
        } catch (e) {
            console.error(e);
        }
    });
};