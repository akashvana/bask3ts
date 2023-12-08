import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

/**
 * Deploys the DCASessionValidationModule contract using the deployer account.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployDCASessionValidationModule: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy("DCASessionValidationModule", {
    from: deployer,
    // The DCASessionValidationModule contract does not take constructor arguments.
    args: [],
    log: true,
    autoMine: true,
  });

  // Optionally, you can get the deployed contract instance if you need to interact with it immediately after deployment
  const dcaSessionValidationModule = await hre.ethers.getContract("DCASessionValidationModule", deployer);
  console.log("DCASessionValidationModule deployed to:", dcaSessionValidationModule.address);
};

export default deployDCASessionValidationModule;

deployDCASessionValidationModule.tags = ["DCASessionValidationModule"];