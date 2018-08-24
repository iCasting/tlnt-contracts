const TLNTToken = artifacts.require("TLNTToken");
const TLNTPresale = artifacts.require("TLNTPresale");
const Settings = require("../Settings");

contract('TLNTToken', (accounts) => {

    it("minted tokens for presale", async () => {
        const presale = await TLNTPresale.deployed();
        const token = await TLNTToken.deployed();
        assert.equal((await token.balanceOf(presale.address)).toNumber(), web3.toWei(Settings.presaleSupply, 'ether'), "minted tokens");
    });

    it("minted tokens for crowdsale", async () => {
        const presale = await TLNTPresale.deployed();
        const token = await TLNTToken.deployed();
        assert.equal((await token.balanceOf(presale.address)).toNumber(), web3.toWei(Settings.crowdsaleSupply, 'ether'), "minted tokens");
    });


});