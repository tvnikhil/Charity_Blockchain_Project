pragma solidity ^0.5.0;

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
    // Required Valid Name
    require(bytes(_name).length > 0);
    // Required Valid coins_wanted
    require(_coins_wanted > 0);
    //Increment organisation count
    orgsCount++;
    //create an organisation
    organisations[orgsCount] = Organisation(orgsCount, _name, _coins_wanted, msg.sender, false);
    //Trigger the event
    emit OrganisationCreated(orgsCount, _name, _coins_wanted, msg.sender, false);
  }

  function giveDonation(uint _id) public payable {
      Organisation memory _org = organisations[_id];
      address payable _addr_org = _org.addr_org;
      require(_org.id > 0 && _org.id <= orgsCount);
      require(msg.value >= _org.coins_wanted);
      require(!_org.reqSatisfied);
      require(_addr_org != msg.sender);
      _org.addr_org = msg.sender;
      // Mark as requirement Satisfied
      _org.reqSatisfied = true;
      // Update the organisation
      organisations[_id] = _org;
      // Pay the organisation
      address(_addr_org).transfer(msg.value);
      // Trigger the event
      emit OrganisationDonated(orgsCount, _org.name, _org.coins_wanted, msg.sender, true);
  }
}
