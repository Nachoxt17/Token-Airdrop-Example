//+-We import the "@metamask/detect-provider" that helps us to detect Metamask:_
import detectEthereumProvider from '@metamask/detect-provider';
//+-We import "Web3.js" to be able to interact with the Blockchain:_
import Web3 from 'web3';
//+-We import "Airdrop.json", a file produced by the Truffle Framework with the details of the Deployment of our S.C. including the Address:_
import Airdrop from '../../build-truffle/Airdrop.json';

const networks = {
  '56': 'Binance Smart Chain Mainnet', 
  '97': 'Binance Smart Chain Testnet', 
  '5777': 'Local development blockchain' 
}

const getBlockchain = () =>
  new Promise( async (resolve, reject) => {
    const provider = await detectEthereumProvider();
    if(provider) {
      //+-We ask to the User to give us access to interact with his/her Metamask Wallet:_
      const accounts = await provider.request({ method: 'eth_requestAccounts' });
      //+-We will see to which Network is the User's Metamask Wallet connected(Ethereum ManiNet, Ropsten TestNet, Binance Smart Chain, etc):_
      const networkId = await provider.request({ method: 'net_version' })
      //+-We will check that the User's Metamask Wallet is connected to the same Network as us:_
      if(networkId !== process.env.NEXT_PUBLIC_NETWORK_ID) {
        const targetNetwork = networks[process.env.NEXT_PUBLIC_NETWORK_ID];
        reject(`Wrong network, please switch to ${targetNetwork}`);
        return;
      }
      /**+-The User's Metamask Wallet was connected to our WebSite in the same Blockchain Network without any error, So we instantiate a new 
      instance of Web3.js:_*/
      const web3 = new Web3(provider);
      //+-We create a pointer to our AirDrop S.C.:_
      const airdrop = new web3.eth.Contract(
        Airdrop.abi,
        Airdrop.networks[networkId].address,
      );
      resolve({airdrop, accounts});
      return;
    }
    reject('Install Metamask');
  });

export default getBlockchain;
