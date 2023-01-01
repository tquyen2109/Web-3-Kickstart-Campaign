const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy({data: compiledFactory.bytecode})
        .send({from: accounts[0], gas: '1000000'});
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    )
});

describe('Campaigns', () => {
    it('should deploy a factory and a campaign',  function () {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it('should marks caller as the campaign manager', async function () {
        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('should allow people to contribute money and marks them as approvers', async function () {
        await campaign.methods.contribute().send({
            value: '200',
            from: accounts[1]
        });
        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);
    });

    it('should requires a minimum contribution', async function () {
        try {
            await campaign.methods.contribute().send({
                value: '2',
                from: accounts[2]
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
});
