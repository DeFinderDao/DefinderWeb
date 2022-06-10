  
import Web3 from "web3";
import Web3Modal from "web3modal";
  

export default {

      
    getUsdtContractAddress : (networkId: string) => {
        let usdtContract = '';
        if(networkId === '1' || networkId === `0x${Number(1).toString(16)}`) {
            usdtContract = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
        } else if(networkId === '4' || networkId === `0x${Number(4).toString(16)}`) {
            usdtContract = '0xD92E713d051C37EbB2561803a3b5FBAbc4962431';
        } else if(networkId === '56' || networkId === `0x${Number(56).toString(16)}`){
            usdtContract = '0x55d398326f99059fF775485246999027B3197955';
        } else if(networkId === '97' || networkId === `0x${Number(97).toString(16)}`){
            usdtContract = '0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7';
        }
        return usdtContract;
    },

      
    initWeb3 : async (networkId: string) => {
        let network = '';
        if(networkId === '1' || networkId === `0x${Number(1).toString(16)}`) {
            network = 'mainnet';
        } else if(networkId === '4' || networkId === `0x${Number(4).toString(16)}`) {
            network = 'rinkeby';
        } else if(networkId === '56' || networkId === `0x${Number(56).toString(16)}`){
            network = 'binance';
        } else if(networkId === '97' || networkId === `0x${Number(97).toString(16)}`) {
            network = 'Binance Smart Chain Testnet';
        }
        let providerOptions;
        if(network === 'binance') {
            providerOptions = {
                walletconnect: {
                    package: null,
                    options: {
                    rpc: {
                        56: 'https://bsc-dataseed.binance.org/'
                    },
                    network: 'binance',
                    }
                }
            }
        } else if(network === 'mainnet') {
            providerOptions = {
                walletconnect: {
                    package: null,
                    options: {
                    rpc: {
                        1: 'https://mainnet.infura.io/v3/'
                    },
                    network: 'mainnet',
                    }
                }
            }
        } else if(network === 'rinkeby') {
            providerOptions = {
                walletconnect: {
                    package: null,
                    options: {
                    rpc: {
                        4: 'https://rinkeby.infura.io/v3/'
                    },
                    network: 'rinkeby',
                    }
                }
            }
        } else if(network === 'bsctest') {
            providerOptions = {
                walletconnect: {
                    package: null,
                    options: {
                    rpc: {
                        97: 'https://data-seed-prebsc-1-s1.binance.org:8545'
                    },
                    }
                }
            }
        } else {
            providerOptions = []
        }
        const web3Modal = new Web3Modal({
            network: network,
            cacheProvider: false,
            disableInjectedProvider: false,
            providerOptions: providerOptions as any
          });
        const provider = await web3Modal.connect();
        const web3 = new Web3(provider);
        return web3;
    },

      
    switchNetwork : (chainId: string) => {
        return window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainId }], // chainId must be in hexadecimal numbers
          });
    },

      
    addNetwork : (networkId: string,chainName: string,rpcUrl: string) => {
        const nativeCurrency = {
            decimals: 18,
            name: networkId === `0x${Number(1).toString(16)}` || networkId === `0x${Number(4).toString(16)}` ? 'ETH' : 
            (networkId === `0x${Number(97).toString(16)}` ? 'tBNB' : 'BNB'),
            symbol: networkId === `0x${Number(1).toString(16)}` || networkId === `0x${Number(4).toString(16)}` ? 'ETH' : 
            (networkId === `0x${Number(97).toString(16)}` ? 'tBNB' : 'BNB'),
        }
        return window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: networkId,
                chainName: chainName,
                rpcUrls: [rpcUrl] /* ... */,
                nativeCurrency
              },
            ],
          });
    },

    isRightNetwork : (networkId: string) => {
        const env = process.env.SERVICES_ENV;
        if(env === 'development' || env === 'test') {
              
            return networkId === '4' || networkId === '97';
        } else {
              
            return networkId === '1' || networkId === '56';
        }
    },

      
    getNetworkId : () => {
        const env = process.env.SERVICES_ENV;
        if(env === 'development' || env === 'test') {
            return [`0x${Number(4).toString(16)}`,`0x${Number(97).toString(16)}`]
        } else {
            return [`0x${Number(1).toString(16)}`,`0x${Number(56).toString(16)}`]
        }
    },

      
    getNetworkName : (networkId: string) => {
        if(networkId === `0x${Number(1).toString(16)}`) {
            return 'Ethereum main network';
        } else if(networkId === `0x${Number(4).toString(16)}`) {
            return 'Rinkeby test network';
        } else if(networkId === `0x${Number(56).toString(16)}`){
            return 'Binance Smart Chain'
        } else if(networkId === `0x${Number(97).toString(16)}`) {
            return 'Binance Smart Chain Testnet'
        } else {
            return '';
        }
    },

      
    getNetworkShortName : (networkId : string) => {
        let network = '';
        if(networkId === '1' || networkId === `0x${Number(1).toString(16)}`) {
            network = 'mainnet';
        } else if(networkId === '4' || networkId === `0x${Number(4).toString(16)}`) {
            network = 'rinkeby';
        } else if(networkId === '56' || networkId === `0x${Number(56).toString(16)}`){
            network = 'binance';
        } else if(networkId === '97' || networkId === `0x${Number(97).toString(16)}`) {
            network = 'bsctest';
        }
        return network;
    },

      
    getRpcUrl : (networkId: String) => {
        if(networkId === `0x${Number(1).toString(16)}`) {
            return 'https://mainnet.infura.io/v3/';
        } else if(networkId === `0x${Number(4).toString(16)}`) {
            return 'https://rinkeby.infura.io/v3/';
        } else if(networkId === `0x${Number(56).toString(16)}`){
            return 'https://bsc-dataseed.binance.org/'
        } else {
            return 'https://data-seed-prebsc-1-s1.binance.org:8545';
        }
    },

      
    getNetworkType : (networkId : string) => {
        let network = '';
        if(networkId === '1' || networkId === `0x${Number(1).toString(16)}`) {
            network = '1';
        } else if(networkId === '4' || networkId === `0x${Number(4).toString(16)}`) {
            network = '1';
        } else if(networkId === '56' || networkId === `0x${Number(56).toString(16)}`){
            network = '2';
        } else if(networkId === '97' || networkId === `0x${Number(97).toString(16)}`) {
            network = '2';
        }
        return network;
    },

    getContractDecimalUnit : (networkId : string) => {
        let unit = 'mwei';
        if(networkId === '1' || networkId === '4') {
            unit = 'mwei';
        } else {
            unit = 'ether'
        }
        return unit;
    },

}