pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/CappedCrowdsale.sol";
import "zeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";
import "./TLNTWhitelist.sol";


contract TLNTCrowdsale is Ownable, CappedCrowdsale, TimedCrowdsale {
    address public finalizeTransferAddress;
    uint256 public constant TOTAL_SHARE = 100;
    uint256 public constant CROWDSALE_SHARE = 60;
    uint256 public constant FOUNDATION_SHARE = 40;
    TLNTWhitelist public whitelist;



    constructor(
        address _wallet,
        address _finalizeTransferAddress,
        ERC20 _token,
        TLNTWhitelist _whitelist,
        uint256 _openingTime,
        uint256 _closingTime,
        uint256 _value,
        uint256 _cap
    ) public
    TimedCrowdsale(_openingTime, _closingTime)
    CappedCrowdsale(_cap)
    Crowdsale(_value, _wallet, _token)
    Ownable()
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

    function finalize() external onlyOwner returns (bool) {
        token.transfer(finalizeTransferAddress, token.balanceOf(this));
        return true;
    }

    function _getTokenAmount(uint256 _weiAmount) internal view returns (uint256)
    {
        return super._getTokenAmount(_weiAmount) + getBonus(_weiAmount, cap-weiRaised);
    }

    function getBonus(uint256 _weiAmountReceived, uint256 _amountLeft) internal view returns (uint256)
    {
        //calculate the initial bonus step
        uint256 bonusStep = _amountLeft / (cap / 5) + 1; // bonus decreases every 20%
        if( bonusStep < 1 )
            return 0;

        uint256 leftInThisBonusStep = _amountLeft % (cap / 5);

        if(leftInThisBonusStep==0) {
            leftInThisBonusStep += cap / 5;
            bonusStep--;
        }

        //is there enough bonus left in this bonusStep?
        uint256 bonusOverWeiAmount = leftInThisBonusStep >= _weiAmountReceived ? _weiAmountReceived : leftInThisBonusStep;
        // calculate the bonus amount (step 5: 50% step 4: 40% etc.)
        uint256 amount = bonusOverWeiAmount * rate / 10 * bonusStep;

        // if there's still an amount left over which no bonus has been received, use it.
        if(bonusOverWeiAmount<_weiAmountReceived)
            return amount+getBonus(_weiAmountReceived - bonusOverWeiAmount, _amountLeft - bonusOverWeiAmount);

        return amount;
    }
}