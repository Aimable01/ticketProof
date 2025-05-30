// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "./EventTicket.sol";
import "./EventManager.sol";

contract TicketMarketplace {
    EventTicket public ticketContract;
    EventManager public eventManager;

    event TicketPurchased(uint256 indexed ticketId, address buyer, uint256 eventId);

    constructor(address _ticketContract, address _eventManager) {
        ticketContract = EventTicket(_ticketContract);
        eventManager = EventManager(_eventManager);
    }

    // Buy a ticket for an event
    function buyTicket(uint256 eventId, string memory seatNumber) external payable {
        // Verify event exists and is active
        (, , , uint256 eventTicketPrice, bool active) = eventManager.getEvent(eventId);
        require(active, "Event is not active");
        require(msg.value >= eventTicketPrice, "Send enough ETH");

        uint256 ticketId = ticketContract.mintTicket(msg.sender, eventId, seatNumber);
        emit TicketPurchased(ticketId, msg.sender, eventId);

        // Refund excess ETH (if any)
        if (msg.value > eventTicketPrice) {
            payable(msg.sender).transfer(msg.value - eventTicketPrice);
        }
    }
}