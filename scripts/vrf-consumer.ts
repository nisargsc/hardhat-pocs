import { ethers } from "hardhat";

async function main() {
  const [buildbear, user] = await ethers.getSigners();
  console.log({ buildbear: buildbear.address, user: user.address });

  // Change this to the address of the mainnet VRF Coordinator
  // CHAINLINK_VRF_ADDRESSES=1:0xD7f86b4b8Cae7D942340FF628F82735b7a20893a,11155111:0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B,56:0xd691f04bc0C9a24Edb78af9E005Cf85768F694C9,97:0xDA3b641D438362C440Ac5458c57e00a712b66700,137:0xec0Ed46f36576541C75739E915ADbCb3DE24bD77,80002:0x343300b5d84D444B2ADc9116FEF1bED02BE49Cf2,43114:0xE40895D055bccd2053dD0638C9695E326152b1A4,42161:0x3C0Ca683b403E37668AE3DC4FB62F4B29B6f7a3e,421614:0x5CE8D5A2BC84beb22a398CCA51996F7930313D61
  const mainnetVRFCoordinatorAddr =
    "0xD7f86b4b8Cae7D942340FF628F82735b7a20893a";
  const linkTokenAddr = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
  console.log({ mainnetVRFCoordinatorAddr, linkTokenAddr });

  const updatedCoordinator = await ethers.getContractAt(
    "VRFCoordinatorV2_5Mock",
    mainnetVRFCoordinatorAddr
  );

  // Create subscription
  console.log("[Coordinator] Creating subscription...");
  const subsTx = await updatedCoordinator.connect(user).createSubscription();
  const subRecipt = await subsTx.wait();
  //@ts-ignore
  const args = subRecipt?.logs[0]?.args;
  const subId = args[0];
  const abiCoder = new ethers.AbiCoder();
  const encodedSubId = abiCoder.encode(["uint256"], [subId]);
  console.log({ subId, encodedSubId });

  // Fund subscription

  // 1.fund with actual LINK
  const linkToken = await ethers.getContractAt(
    "LinkTokenInterface",
    linkTokenAddr
  );
  const value = 50;
  console.log(`Transferring ${value} LINK to subscription...`);
  const linkTxn = await linkToken
    .connect(user)
    .transferAndCall(mainnetVRFCoordinatorAddr, BigInt(value * 1e18), encodedSubId);
  await linkTxn.wait();

  // 2.fund with mock amount
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
  const consumerAddr = consumerMock.target;
  console.log({ consumerAddr });

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
  // console.log("[Coordinator] Fulfilling random words...");
  // const fulfillRandomnessTx = await updatedCoordinator
  //   .connect(buildbear)
  //   .fulfillRandomWords(reqId, consumerAddr);
  // await fulfillRandomnessTx.wait();

  console.log(
    "Waiting for request to be fulfilled.... Sleeping for 60 seconds..."
  );
  await new Promise((resolve) => setTimeout(resolve, 60000));
  console.log("Finished sleeping.");

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
