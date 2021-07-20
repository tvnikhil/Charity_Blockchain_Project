const { assert } = require('chai');

const CharityChain = artifacts.require("CharityChain.sol");

require('chai').use(require('chai-as-promised')).should()

contract('CharityChain', ([deployer, org, donor]) => {
    let charitychain

    before(async () => {
        charitychain = await CharityChain.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await charitychain.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await charitychain.name()
            assert.equal(name, 'Charity Chain')
        })
    })

    describe('organisations', async () => {
        let result, orgsCount

        before(async () => {
            result = await charitychain.createOrganisation('Rainbow-Hospitals', web3.utils.toWei('1', 'Ether'), { from: org })
            orgsCount = await charitychain.orgsCount()
        })

        it('creates organisations', async () => {
            assert.equal(orgsCount, 1)
            // console.log(result.logs)
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), orgsCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'Rainbow-Hospitals', 'name is correct')
            assert.equal(event.coins_wanted, '1000000000000000000', 'coins_wanted is correct')
            assert.equal(event.addr_org, org, 'Addr is correct')
            assert.equal(event.reqSatisfied, false, 'reqSatisfied is correct')

            await charitychain.createOrganisation('', web3.utils.toWei('1', 'Ether'), { from: org }).should.be.rejected;
            await charitychain.createOrganisation('Rainbow-Hospitals', 0, { from: org }).should.be.rejected;
        })

        it('lists organisations', async () => {
            const organisation = await charitychain.organisations(orgsCount)

            assert.equal(organisation.id.toNumber(), orgsCount.toNumber(), 'id is correct')
            assert.equal(organisation.name, 'Rainbow-Hospitals', 'name is correct')
            assert.equal(organisation.coins_wanted, '1000000000000000000', 'coins_wanted is correct')
            assert.equal(organisation.addr_org, org, 'Addr is correct')
            assert.equal(organisation.reqSatisfied, false, 'reqSatisfied is correct')
        })

        it('receives coins', async () => {
            //const organisation = await charitychain.organisations(orgsCount)
            //console.log(organisation.coins_wanted)
            //console.log(organisation.reqSatisfied)

            let oldOrgBalance = await web3.eth.getBalance(org)
            oldOrgBalance = new web3.utils.BN(oldOrgBalance)
            let oldDonorBalance = await web3.eth.getBalance(donor)
            oldDonorBalance = new web3.utils.BN(oldDonorBalance)

            result = await charitychain.giveDonation(orgsCount, { from: donor, value: web3.utils.toWei('1', 'Ether') })

            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), orgsCount.toNumber(), 'id is correct')
            assert.equal(event.name, 'Rainbow-Hospitals', 'name is correct')
            assert.equal(event.coins_wanted, '1000000000000000000', 'coins_wanted is correct')
            assert.equal(event.addr_org, donor, 'Addr is correct')
            //assert.equal(event.reqSatisfied, true, 'reqSatisfied is correct')
            
            let newOrgBalance = await web3.eth.getBalance(org)
            newOrgBalance = new web3.utils.BN(newOrgBalance)
            let newDonorBalance = await web3.eth.getBalance(donor)
            newDonorBalance = new web3.utils.BN(newDonorBalance)

            let coins = web3.utils.toWei('1', 'Ether')
            coins = new web3.utils.BN(coins)

            //console.log(oldOrgBalance, oldDonorBalance, coins)
            //console.log(newOrgBalance, newDonorBalance, coins)

            const expectedBalance = oldOrgBalance.add(coins)
            assert.equal(newOrgBalance.toString(), expectedBalance.toString())
        
            await charitychain.giveDonation(99, { from: donor, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
            await charitychain.giveDonation(orgsCount, { from: donor, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected
            await charitychain.giveDonation(orgsCount, { from: org, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
        })
    })
})