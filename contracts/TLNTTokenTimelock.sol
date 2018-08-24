pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/TokenTimeLock.sol";


contract TLNTTokenTimelock is TokenTimelock {

    constructor(
        ERC20Basic _token,
        address _beneficiary,
        uint256 _releaseTime
    )
    public
    TokenTimelock(_token, _beneficiary, _releaseTime)
    {
    }
}