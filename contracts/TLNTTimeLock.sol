pragma solidity ^0.4.18;

/**
 * uses code from https://github.com/OpenZeppelin/zeppelin-solidity/pull/569
 * WARNING, -----------------  PRERELEASE CODE  -------------------
 * will have to be checked thrice before release and hopefully final version of this will be released soon
 *
 * @title EtherTimelock
 * @dev EtherTimelock is a contract that will allow a
 * beneficiary to extract ether sent to it after a given release time
 */


contract TLNTTimeLock {
    //beneficiary of funds
    address public beneficiary;

    //timestamp when funds are able to be released
    uint256 public releaseTime;

    constructor(address _beneficiary, uint256 _releaseTime) public {
        require(_releaseTime > now);
        require(_beneficiary != address(0));

        beneficiary = _beneficiary;
        releaseTime = _releaseTime;
    }

    function () public payable {

    }

    /**
    * @notice Transfers funds held by timelock to beneficiary.
    */
    function release() public {
        require(now > releaseTime);
        require(address(this).balance > 0);

        beneficiary.transfer(address(this).balance);
    }
}