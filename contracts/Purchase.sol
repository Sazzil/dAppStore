pragma solidity ^0.4.17;

contract Purchase {
    address[16] public buyers;
    // Buy a product
    function buy(uint appId) public returns (uint) {
    require(appId >= 0 && appId <= 15);

    buyers[appId] = msg.sender;

    return appId;
    }

    // Retrieving the buyers
    function getBuyers() public view returns (address[16]) {
    return buyers;
    }
}