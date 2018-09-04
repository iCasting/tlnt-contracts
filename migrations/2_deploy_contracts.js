const TLNTToken = artifacts.require("TLNTToken");
const TLNTCrowdsale = artifacts.require("TLNTCrowdsale");
const TLNTPresale = artifacts.require("TLNTPresale");
const TLNTTimeLock = artifacts.require("TLNTTimeLock");
const TLNTWhitelist = artifacts.require("TLNTWhitelist");
const TokenTimelock = artifacts.require("TLNTTokenTimeLock");
const Settings = require("../Settings");
const sleep = require("await-sleep");

module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        try {
            console.log("Tokens for every wei:", Settings.tokenPrice);

            await deployer.deploy(TLNTToken);
            const token = await TLNTToken.deployed();

            await deployer.deploy(TLNTWhitelist);
            const whitelist = await TLNTWhitelist.deployed();

            //for the unit tests we use the current time, this will have to be changed for final deployment.
            await deployer.deploy(TLNTTimeLock, Settings.multiSig, Settings.crowdsaleEnd);
            const lock = await TLNTTimeLock.deployed();

            await deployer.deploy(
                TLNTCrowdsale,
                Settings.multiSig,
                lock.address,
                token.address,
                whitelist.address,
                Settings.crowdsaleStart,
                Settings.crowdsaleEnd,
                Settings.tokenPrice,
                web3.toWei(Settings.cap, 'ether')
            );
            const crowdsale = await TLNTCrowdsale.deployed();

            await deployer.deploy(
                TLNTPresale,
                lock.address,
                Settings.multiSig,
                token.address,
                whitelist.address,
                Settings.presaleStart,
                Settings.presaleEnd,
                Settings.tokenPrice
            );
            const presale = await TLNTPresale.deployed();

            //an example of a single vesting address
            await deployer.deploy(
                TokenTimelock,
                token.address,
                accounts[8],
                Settings.vestingEnd,
            );
            const vestingAddress = await TokenTimelock.deployed();

            // reserve tokens for the presale
            await token.mint(presale.address, web3.toWei(Settings.presaleSupply, 'ether'));

            // reserve tokens for the crowdsale
            await token.mint(crowdsale.address, web3.toWei(Settings.crowdsaleSupply, 'ether'));

            // allocate tokens to a vesting address
            await token.mint(vestingAddress.address, web3.toWei(10, 'ether'));

            console.log("1");
            await sleep(3000); //wait for the crowdsale to "start"

            console.log("deploy done");
        } catch (e) {
            console.error("DEPLOY ERROR!", e);
        }
    });
};