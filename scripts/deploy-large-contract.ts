import { config, ethers } from "hardhat";

async function main() {
  const { blockGasLimit, allowUnlimitedContractSize } = config.networks.hardhat;
  console.log("hardhat network config:", {
    blockGasLimit,
    allowUnlimitedContractSize,
  });
  const LargeContract = await ethers.getContractFactory("LargeContract");
  const largeContract = await LargeContract.deploy({
    // gasLimit: blockGasLimit,
    gasPrice: ethers.parseEther("1000000"),
  });

  await largeContract.waitForDeployment();

  console.log(`LargeContract deployed to ${largeContract.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
