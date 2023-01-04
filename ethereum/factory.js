import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface),'0x2e1d7e92e48865a42aA420bA49A147556754bAfd');
export default instance;
