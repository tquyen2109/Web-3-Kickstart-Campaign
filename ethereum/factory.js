import web3 from "./web3";
import CampaignFactory from './build/CampaignFactory.json'

const instance = new web3.eth.Contract(JSON.parse(CampaignFactory.interface),'0x81FF4258d149CbFA913e2b7FdDf82517fFAfC470');
export default instance;
