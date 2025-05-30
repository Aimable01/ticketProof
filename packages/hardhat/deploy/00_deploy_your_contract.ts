import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { EventManager } from "../typechain-types";

const deployTicketingSystem: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // Deploy EventManager
  const eventManager = await deploy("EventManager", {
    from: deployer,
    args: [deployer], // Pass deployer as initialOwner for Ownable
    log: true,
    autoMine: true, // Faster deployment on local networks
  });

  // Deploy TicketMarketplace with a temporary address (will update later)
  const ticketMarketplacePlaceholder = await deploy("TicketMarketplace", {
    from: deployer,
    args: [ethers.ZeroAddress, eventManager.address], // Temporary EventTicket address
    log: true,
    autoMine: true,
  });

  // Deploy EventTicket with TicketMarketplace address
  const eventTicket = await deploy("EventTicket", {
    from: deployer,
    args: [ticketMarketplacePlaceholder.address],
    log: true,
    autoMine: true,
  });

  // Re-deploy TicketMarketplace with correct EventTicket and EventManager addresses
  const ticketMarketplace = await deploy("TicketMarketplace", {
    from: deployer,
    args: [eventTicket.address, eventManager.address],
    log: true,
    autoMine: true,
  });
  console.log("TicketMarketplace deployed at address:", ticketMarketplace.address);

  // Optional: Test interaction (create an event)
  const eventManagerContract = (await ethers.getContractAt("EventManager", eventManager.address)) as EventManager;
  await eventManagerContract.createEvent(
    "Test Concert",
    Math.floor(Date.now() / 1000) + 86400, // Tomorrow
    100,
    ethers.parseEther("0.01"),
  );
  console.log("Test event created in EventManager at address:", eventManager.address);
};

export default deployTicketingSystem;

// Tags for running specific deployments
deployTicketingSystem.tags = ["TicketingSystem", "EventManager", "EventTicket", "TicketMarketplace"];
