const TLNTToken = artifacts.require("TLNTToken");
const TLNTPresale = artifacts.require("TLNTPresale");

contract('TLNTToken', (accounts) => {

    it("minted tokens for presale", async () => {
        const presale = await TLNTPresale.deployed();
        const token = await TLNTToken.deployed();
        assert.equal((await token.balanceOf(presale.address)).toNumber(), web3.toWei(17500000, 'ether'), "minted tokens");
    });


});