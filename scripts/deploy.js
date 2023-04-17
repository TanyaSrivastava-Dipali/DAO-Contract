const hre = require("hardhat");

async function main() {

    // Deploy the Token contract.
	const [deployer] = await hre.ethers.getSigners();

	const Token = await hre.ethers.getContractFactory("Token");
	const token = await Token.connect(deployer).deploy("GovToken", "GT", 1000000000000);
	console.log("Token Contract address", token.address);

    // Deploy the TimeLock contract.
    const TimeLock = await hre.ethers.getContractFactory("TimeLock");
    const timeLock = await TimeLock.deploy(1, [], ["0x0000000000000000000000000000000000000000"],deployer.address);
    console.log("TimeLock contract address ", timeLock.address);

    // Deploy the Governance contract.
    const Governance = await hre.ethers.getContractFactory("MyGovernor");
    const governance = await Governance.deploy(
        token.address,
        timeLock.address, 
    );
    console.log("Governance contract address", governance.address);

    // Deploy the Treasury contract.
    const Treasury = await hre.ethers.getContractFactory("Treasury");
    const treasury = await Treasury.deploy();
    console.log("Treasury contract address", treasury.address);



    // Make TimeLock contract the owner of Treasury contract.
    await treasury.transferOwnership(timeLock.address);

    // Make DAO contract the proposer of TimeLock contract.
    await timeLock.grantRole(await timeLock.PROPOSER_ROLE(), governance.address);
    await timeLock.grantRole(await timeLock.EXECUTOR_ROLE(), governance.address);

      // Send some ethers to Treasury contract.
      const ethTxn = await deployer.sendTransaction({
        to: treasury.address,
        value: ethers.utils.parseEther("1")
    });
    await ethTxn.wait();
    console.log("Sent 1 ethers to Treasury contract");

    // // Mint the BLZ voting tokens to other addresses.
    // await token.mint(wallets[1].address, 10000);
    // await token.mint(wallets[2].address, 10000);
    // await token.mint(wallets[3].address, 10000);
    // await token.mint(wallets[4].address, 10000);
    // console.log("-> Minted BLZ voting tokens to other addresses.")

    // // Delegate BLZ voting tokens through each account to itself.
    // await token.connect(wallets[1]).delegate(wallets[1].address);
    // await token.connect(wallets[2]).delegate(wallets[2].address);
    // await token.connect(wallets[3]).delegate(wallets[3].address);
    // await token.connect(wallets[4]).delegate(wallets[4].address);
    // console.log("-> Delegated voting power of each address to itself");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })