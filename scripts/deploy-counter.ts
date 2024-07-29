import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
const logPath = path.join(__dirname, "../logs/counter-events.log");
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, "");
}

async function main() {
  fs.writeFileSync(logPath, "-----------start------------\n");
  const [deployer] = await ethers.getSigners();
  const counter = await ethers.deployContract("Counter");

  await counter.waitForDeployment();

  console.log(
    `Counter deployed to ${counter.target}`
  );

  const tx1 = await counter.set(10);
  const rsp1 = await tx1.wait();
  fs.appendFileSync(logPath, JSON.stringify(rsp1) + "\n");
  console.log(rsp1)

  const tx2 = await counter.increment();
  const rsp2 = await tx2.wait();
  fs.appendFileSync(logPath, JSON.stringify(rsp2) + "\n");
  console.log(rsp2);

  const tx3 = await counter.emitEvent(10000, deployer.address, "Hello World");
  const rsp3 = await tx3.wait();
  fs.appendFileSync(logPath, JSON.stringify(rsp3) + "\n");
  console.log(rsp3);
  fs.writeFileSync(logPath, "-----------end------------\n");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
