pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/token/ERC20/PausableToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/CappedToken.sol";
import "zeppelin-solidity/contracts/token/ERC20/BurnableToken.sol";


contract TLNTToken is CappedToken {
    string public name = "Talent";
    string public symbol = "TLNT";
    uint8 public decimals = 18;

    function TLNTToken() public
    CappedToken(350000000 ether)
    {
    }
}