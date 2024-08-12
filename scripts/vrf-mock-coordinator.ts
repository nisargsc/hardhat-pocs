import { ethers } from "hardhat";
import fs from "fs";
import path from "path";
import { VRF_MOCK_BYTECODE } from "./vrf-mock-code";
const logPath = path.join(__dirname, "../logs/vrf.log");
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, "");
}

async function main() {
  const privateKey = "YOUR_PRIVATE_KEY";
  const wallet = new ethers.Wallet(privateKey);
  const signer = wallet.connect(ethers.provider);
  const [buildbear, user] = await ethers.getSigners();
  console.log({ buildbear: buildbear.address, user: user.address });

  const mainnetVRFCoordinatorAddr =
    "0xd7f86b4b8cae7d942340ff628f82735b7a20893a";
  console.log({ mainnetVRFCoordinatorAddr });
  // const mainnetVRFCode = await ethers.provider.send("eth_getCode", [
  //   mainnetVRFCoordinatorAddr,
  //   "latest",
  // ]);
  // console.log({ mainnetVRFCoordinatorAddr, mainnetVRFCode });

  // Deploy coordinator
  // console.log("Deploying Mock Coordinator...");
  // const coordinatorMock = await ethers.deployContract(
  //   "VRFCoordinatorV2_5Mock",
  //   [
  //     BigInt("100000000000000000"),
  //     BigInt("1000000000"),
  //     BigInt("4104360000000000"),
  //   ],
  //   buildbear
  // );

  // await coordinatorMock.waitForDeployment();
  // const mainnetVRFCoordinatorAddr = coordinatorMock.target;

  // console.log(`VRF Coordinator Mock deployed to ${coordinatorMock.target}`);

  // console.log("Updating the mainnet coordinator code to the mock code...");
  // const mockCode = await ethers.provider.send("eth_getCode", [
  //   coordinatorMock.target,
  //   "latest",
  // ]);
  // fs.writeFileSync(logPath, JSON.stringify(mockCode) + "\n");
  // await ethers.provider.send("hardhat_setCode", [
  //   mainnetVRFCoordinatorAddr,
  //   VRF_MOCK_BYTECODE,
  // ]);
  // const updatedVRFCode = await ethers.provider.send("eth_getCode", [
  //   mainnetVRFCoordinatorAddr,
  //   "latest",
  // ]);
  // console.log({ updatedVRFCode });

  const updatedCoordinator = await ethers.getContractAt(
    "VRFCoordinatorV2_5Mock",
    mainnetVRFCoordinatorAddr
  );
  // const updatedCoordinator = await ethers.getContractAt(
  //   "VRFCoordinatorV2_5Mock",
  //   mockAddr
  // );

  // Create subscription
  // console.log("[Coordinator] Creating subscription...");
  // const subsTx = await updatedCoordinator.connect(user).createSubscription();
  // const subRecipt = await subsTx.wait();
  // // @ts-ignore
  // const args = subRecipt?.logs[0]?.args;
  // const subId = args[0];
  const subId = "20342667800601792528536539555806318142439575802735528341264238284279717765858"
  console.log({ subId });

  // Fund subscription
  // const linkAmount = "99999999999999999999";
  // console.log(
  //   `[Coordinator] Funding subscription with ${linkAmount} Mock LINK...`
  // );
  // const fundSubTx = await updatedCoordinator
  //   .connect(user)
  //   .fundSubscription(subId, BigInt(linkAmount));
  // await fundSubTx.wait();

  // Deploy consumer
  console.log("Deploying consumer...");
  const consumerMock = await ethers.deployContract(
    "RandomNumberConsumerV2_5",
    [
      subId,
      mainnetVRFCoordinatorAddr,
      "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae",
    ],
    user
  );
  await consumerMock.waitForDeployment();
  console.log(`VRF Consumer Mock deployed to ${consumerMock.target}`);
  const consumerAddr = consumerMock.target;

  // Add consumer to coordinator
  console.log("[Coordinator] Adding consumer to coordinator...");
  const addCosumerTx = await updatedCoordinator
    .connect(user)
    .addConsumer(subId, consumerAddr);
  await addCosumerTx.wait();

  // Request random words
  console.log("[Consumer] Requesting random words...");
  const requestRandomnessTx = await consumerMock
    .connect(user)
    .requestRandomWords();
  await requestRandomnessTx.wait();

  const reqId = await consumerMock.connect(user).s_requestId();
  console.log({ reqId });

  // Fulfill random words
  console.log("[Coordinator] Fulfilling random words...");
  const fulfillRandomnessTx = await updatedCoordinator
    .connect(user)
    .fulfillRandomWords(reqId, consumerAddr);
  await fulfillRandomnessTx.wait();

  // Check random word
  console.log("[Consumer] Checking random word...");
  let randomWord = await consumerMock.connect(user).s_randomWords(0);
  console.log({ randomWord });
  randomWord = await consumerMock.connect(user).s_randomWords(1);
  console.log({ randomWord });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
