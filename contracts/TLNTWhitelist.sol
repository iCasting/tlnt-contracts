pragma solidity ^0.4.18;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract TLNTWhitelist is Ownable{
    event WhitelistUpdated(address indexed _account, uint8 _phase);
    mapping(address => uint8) public whitelist;
    mapping(address => bool) public managers;

    /**
     * @dev Throws if called by any account other than one of the managers.
     */
    modifier onlyManagers(address _address) {
        require(managers[_address]);
        _;
    }

    /**
     * @dev check if address is a manager.
     * @param _address the address te check
     */
    function isManager(address _address) external view onlyManagers(_address) returns (bool) {
        return true;
    }

    /**
     * @dev Adds single address to managers.
     * @param _manager Address to be added to the managers
     * @param _isManager should the address be set as a manager
     */
    function setManager(address _manager, bool _isManager) external onlyOwner {
        managers[_manager] = _isManager;
    }

    /**
     * @dev check if address is on whitelist.
     * @param _address the address te check
     */
    function isWhiteListed(address _address) external view returns (uint8) {
        return whitelist[_address];
    }

    /**
     * @dev Adds single address to whitelist.
     * @param _address Address to whitelist
     * @param _phase The whitelisting phase
     */
    function updateWhitelist(address _address, uint8 _phase) external onlyManagers(msg.sender) returns (bool) {
        whitelist[_address] = _phase;
        emit WhitelistUpdated(_address, _phase);
        return true;
    }
}