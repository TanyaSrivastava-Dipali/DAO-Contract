// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Treasury is Ownable {
    uint256 public totalFunds;
    bool public isReleased;

    constructor() payable {
        totalFunds = msg.value;
        isReleased = false;
    }

    receive() external payable {}

    function releaseFunds(address _payee) public onlyOwner {
        isReleased = true;
        payable(_payee).transfer(totalFunds);
    }
}
