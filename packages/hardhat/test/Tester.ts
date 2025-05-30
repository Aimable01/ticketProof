import { expect } from "chai";
import { ethers } from "hardhat";
import { EventManager, EventTicket, TicketMarketplace } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Ticketing System", function () {
  let EventManagerFactory: any, EventTicketFactory: any, TicketMarketplaceFactory: any;
  let eventManager: EventManager;
  let ticket: EventTicket;
  let marketplace: TicketMarketplace;
  let owner: SignerWithAddress;
  let buyer: SignerWithAddress;

  beforeEach(async function () {
    // Get signers
    [owner, buyer] = await ethers.getSigners();

    // Get contract factories
    EventManagerFactory = await ethers.getContractFactory("EventManager");
    EventTicketFactory = await ethers.getContractFactory("EventTicket");
    TicketMarketplaceFactory = await ethers.getContractFactory("TicketMarketplace");

    // Deploy EventManager
    eventManager = await EventManagerFactory.deploy(owner.address);
    await eventManager.waitForDeployment();

    // Deploy TicketMarketplace with placeholder address
    marketplace = await TicketMarketplaceFactory.deploy(ethers.ZeroAddress, eventManager.target);
    await marketplace.waitForDeployment();

    // Deploy EventTicket
    ticket = await EventTicketFactory.deploy(marketplace.target);
    await ticket.waitForDeployment();

    // Re-deploy TicketMarketplace with correct EventTicket address
    marketplace = await TicketMarketplaceFactory.deploy(ticket.target, eventManager.target);
    await marketplace.waitForDeployment();
  });

  it("should create an event and buy a ticket", async function () {
    // Create an event
    const futureDate = Math.floor(Date.now() / 1000) + 86400; // Tomorrow
    await eventManager.connect(owner).createEvent("Concert", futureDate, 100, ethers.parseEther("0.01"));

    // Buy a ticket
    await marketplace.connect(buyer).buyTicket(1, "A12", { value: ethers.parseEther("0.01") });

    // Verify ticket ownership
    expect(await ticket.ownerOf(1)).to.equal(buyer.address);

    // Verify ticket details
    const ticketData = await ticket.tickets(1);
    expect(ticketData.eventId).to.equal(1);
    expect(ticketData.seatNumber).to.equal("A12");
    expect(ticketData.isUsed).to.equal(false);

    // Verify event details
    const eventData = await eventManager.getEvent(1);
    expect(eventData.name).to.equal("Concert");
    expect(eventData.totalTickets).to.equal(100);
    expect(eventData.ticketPrice).to.equal(ethers.parseEther("0.01"));
    expect(eventData.active).to.equal(true);
  });

  it("should not allow buying a ticket for an inactive event", async function () {
    // Create and deactivate an event
    const futureDate = Math.floor(Date.now() / 1000) + 86400;
    await eventManager.connect(owner).createEvent("Concert", futureDate, 100, ethers.parseEther("0.01"));
    await eventManager.connect(owner).deactivateEvent(1);

    // Attempt to buy a ticket
    await expect(
      marketplace.connect(buyer).buyTicket(1, "A12", { value: ethers.parseEther("0.01") }),
    ).to.be.revertedWith("Event is not active");
  });
});
