import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.19",
      },
      {
        version: "0.8.20",
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    proxy: {
      url: "http://127.0.0.1:8585/rpc",
    },
    localNode: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      // blockGasLimit: 40000000,
      forking: {
        url: "https://rpc.ankr.com/eth",
      },
      allowUnlimitedContractSize: true,
      accounts: {
        mnemonic: "patrol camera market radio aspect raw alien hurdle puppy captain rain hold",
        accountsBalance: "1000000000000000000000000000000000",
      },
    },
    local: {
      url: "http://localhost:5000/node/technological-finis-valorum-d0f0083e",
    },
    buildbear: {
      url: "https://rpc.dev.buildbear.io/outdoor-kingpin-4bef4db2",
    },
    prod: {
      url: "https://rpc.buildbear.io/amused-kingpin-e07fd31a",
    },
    bbnisarg: {
      url: "https://rpc.dev.buildbear.io/bbnisarg",
    },
    sanam: {
      url: "https://rpc.dev.buildbear.io/sanam",
    },
  },
  etherscan: {
    enabled: false,
    apiKey: {
      bbnisarg: "verifyContract",
    },
    customChains: [
      {
        network: "bbnisarg",
        chainId: 1,
        urls: {
          apiURL: "https://bbnisarg.blockscout.dev.buildbear.io/api",
          browserURL: "https://bbnisarg.blockscout.dev.buildbear.io/",
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
    // apiUrl:
    //   "http://kube.dev.buildbear.io/sourcify-jealous-thanos-aba2d451/",
    // apiUrl: "https://bbnisarg.blockscout.dev.buildbear.io/api",
    apiUrl: "https://rpc.dev.buildbear.io/verify/sourcify/server/bbnisarg",
  },
};

export default config;
