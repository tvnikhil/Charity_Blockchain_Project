// SPDX-License-Identifier: MIT

pragma solidity >=0.8.6;

contract TokenFarm {
    uint256 a = 10;
    uint256 b = 20;
    uint256 s;

    function getRes() public returns (uint256) {
        s = a + b;
        return s;
    }
}
