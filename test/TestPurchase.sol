pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Purchase.sol";

contract TestPurchase {
  Purchase purchase = Purchase(DeployedAddresses.Purchase());
   // Testing the buy() function
    function testUserCanBuy() public {
    uint returnedId = purchase.buy(8);

    uint expected = 8;

    Assert.equal(returnedId, expected, "Sell of application ID 8 should be recorded.");
    }

    // Testing retrieval of a single app buyer
    function testGetBuyerAddressByAppId() public {
    // Expected buyer is this contract
    address expected = this;

    address buyer = purchase.buyers(8);

    Assert.equal(buyer, expected, "Buyer of app ID 8 should be recorded.");
    }

    // Testing retrieval of all buyers
    function testGetBuyerAddressByAppIdInArray() public {
    // Expected buyer is this contract
    address expected = this;

    // Store buyers in memory rather than contract's storage
    address[16] memory buyers = purchase.getBuyers();

    Assert.equal(buyers[8], expected, "Buyer of app ID 8 should be recorded.");
    }
}