// SPDX-License-Identifier: MIT

pragma solidity >=0.8.6;

contract TokenFarm {
    uint a = 10;
    uint b = 20;
    uint s;

    function getRes() public returns (uint) {
        s = a + b;
        return s;
    }
}
