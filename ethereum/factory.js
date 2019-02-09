import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x54B741c452BE7B9c677E5e8849c9097327e6Ea8e'
);

export default instance;
