// SPDX-License-Identifier: MIT

pragma solidity ^0.5.16;

contract CharityChain {
    uint256 a = 10;
    uint256 b = 200;
    uint256 s;

    function getRes() public returns (uint256) {
        s = a + b;
        return s;
    }
}
