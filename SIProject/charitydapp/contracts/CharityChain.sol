// SPDX-License-Identifier: MIT

pragma solidity ^0.5.16;

contract CharityChain {
    string public name;
    uint public orgsCount = 0;
    
    mapping(uint => Organisation) public organisations;
    
    struct Organisation {
        uint id;
        string name;
        uint coins_wanted;
        address payable addr_org;
        bool reqSatisfied;
    }
    
    event OrganisationCreated (
        uint id,
        string name,
        uint coins_wanted,
        address payable addr_org,
        bool reqSatisfied
    );
    
    event OrganisationDonated (
        uint id,
        string name,
        uint coins_wanted,
        address payable addr_org,
        bool reqSatisfied
    );
    
    constructor() public {
        name = "Charity Chain";
    }
    
    function createOrganisation(string memory _name, uint _coins_wanted) public {
        require(bytes(_name).length > 0);
        require(_coins_wanted > 0);
        
        orgsCount++;
        organisations[orgsCount] = Organisation(orgsCount, _name, _coins_wanted, msg.sender, false);
        
        emit OrganisationCreated(orgsCount, _name, _coins_wanted, msg.sender, false);
    }
    
    function giveDonation(uint _id) public payable{
        Organisation memory _org = organisations[_id];
        
       address payable _addr_org = _org.addr_org;
       
       require(_org.id > 0 && _org.id <= orgsCount);
       require(!_org.reqSatisfied);
       require(_addr_org != msg.sender);
       
       _addr_org.transfer(msg.value);
       
       if (_addr_org.balance >= _org.coins_wanted) {
           _org.reqSatisfied = true;
       }
       organisations[_id] = _org;
       
       emit OrganisationDonated(orgsCount, _org.name, _org.coins_wanted, msg.sender, _org.reqSatisfied);
    }
}
