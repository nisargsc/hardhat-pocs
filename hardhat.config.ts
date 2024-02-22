import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-contract-sizer";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    localNode: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
      blockGasLimit: 40000000,
      allowUnlimitedContractSize: true,
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        accountsBalance: "1000000000000000000000000000000000",
      },
    },
    local: {
      url: "http://localhost:5000/node/technological-finis-valorum-d0f0083e",
    },
    buildbear: {
      url: "https://rpc.dev.buildbear.io/above-wasp-44dda7b4"
    }
  },
  etherscan: {
    enabled: false,
  },
  sourcify: {
    enabled: true,
    apiUrl: "https://rpc.dev.buildbear.io/verify/sourcify/server/above-wasp-44dda7b4",
  },
};

export default config;
