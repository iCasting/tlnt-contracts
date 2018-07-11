pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "./TLNTWhitelist.sol";


contract TLNTCrowdsale is CappedCrowdsale {
    uint256 public constant TOTAL_SHARE = 100;
    uint256 public constant CROWDSALE_SHARE = 60;
    uint256 public constant FOUNDATION_SHARE = 40;
    TLNTWhitelist public whitelist;

    function TLNTCrowdsale(address _wallet, ERC20 _token, TLNTWhitelist _whitelist) public
    CappedCrowdsale(86206 ether)
    Crowdsale(22857, _wallet, _token)
    {
        whitelist = _whitelist;
    }

    /**
     * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use super to concatenate validations.
     * @param _beneficiary Address performing the token purchase
     * @param _weiAmount Value in wei involved in the purchase
     */
    function _preValidatePurchase(address _beneficiary, uint256 _weiAmount) internal {
        require(whitelist.isWhiteListed(_beneficiary) > 0);
        return super._preValidatePurchase(_beneficiary, _weiAmount);
    }

    /**
    * @todo tiered pricing
    */
}