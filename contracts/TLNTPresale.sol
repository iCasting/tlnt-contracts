pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "./TLNTWhitelist.sol";


contract TLNTPresale is Ownable, TimedCrowdsale {
    address public finalizeTransferAddress;
    TLNTWhitelist public whitelist;

    /*
     * at the current eth price of 750$ every token is 800/0.035*10^-18 = 2.2857143e-14
     * this means you'll receive  for every wei
     */
    constructor(
        address _wallet,
        address _finalizeTransferAddress,
        ERC20 _token,
        TLNTWhitelist _whitelist,
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _value

    ) public
    TimedCrowdsale(_openingTime, _closingTime)
    Crowdsale(_value, _wallet, _token)
    Ownable()
    {
        whitelist = _whitelist;
        finalizeTransferAddress = _finalizeTransferAddress;
    }

    /**
     * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use super to concatenate validations.
     * @param _beneficiary Address performing the token purchase
     * @param _weiAmount Value in wei involved in the purchase
     */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
        require(whitelist.isWhiteListed(_beneficiary) == 1);
        return super._preValidatePurchase(_beneficiary, _weiAmount);
    }

    function finalize() external onlyOwner returns (bool) {
        token.transfer(finalizeTransferAddress, token.balanceOf(this));
        return true;
    }
}