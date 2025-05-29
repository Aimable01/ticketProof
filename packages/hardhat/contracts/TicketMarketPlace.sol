// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./EventTicket.sol";

contract TicketMarketplace is Ownable {
    EventTicket public ticketContract;
    uint256 public constant MAX_RESALE_PRICE = 1 ether; // Example cap
    mapping(uint256 => uint256) public ticketPrices;

    event TicketPurchased(uint256 indexed ticketId, address buyer, uint256 price);
    event TicketResold(uint256 indexed ticketId, address seller, address buyer, uint256 price);

    constructor(address _ticketContract) {
        ticketContract = EventTicket(_ticketContract);
    }

    function buyTicket(uint256 eventId, string memory seatNumber, uint256 price) external payable {
        require(msg.value >= price, "Insufficient payment");
        uint256 ticketId = ticketContract.mintTicket(msg.sender, eventId, seatNumber);
        ticketPrices[ticketId] = price;
        emit TicketPurchased(ticketId, msg.sender, price);
        // Transfer payment to organizer (simplified)
    }

    function resellTicket(uint256 ticketId, uint256 price) external {
        require(ticketContract.ownerOf(ticketId) == msg.sender, "Not ticket owner");
        require(price <= MAX_RESALE_PRICE, "Price exceeds cap");
        require(!ticketContract.tickets(ticketId).isUsed, "Ticket already used");
        ticketPrices[ticketId] = price;
        ticketContract.safeTransferFrom(msg.sender, address(this), ticketId);
        emit TicketResold(ticketId, msg.sender, address(this), price);
    }

    function buyResoldTicket(uint256 ticketId) external payable {
        require(ticketContract.ownerOf(ticketId) == address(this), "Ticket not for resale");
        require(msg.value >= ticketPrices[ticketId], "Insufficient payment");
        ticketContract.safeTransferFrom(address(this), msg.sender, ticketId);
        emit TicketPurchased(ticketId, msg.sender, ticketPrices[ticketId]);
        // Transfer payment to seller (simplified)
    }
}