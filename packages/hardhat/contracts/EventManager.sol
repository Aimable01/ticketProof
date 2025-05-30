// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EventManager is Ownable {
    struct Event {
        string name;
        uint256 date;
        uint256 totalTickets;
        uint256 ticketPrice;
        bool active;
    }

    mapping(uint256 => Event) public events;
    uint256 public eventCount;

    // Events for tracking actions
    event EventCreated(uint256 indexed eventId, string name, uint256 ticketPrice);
    event EventDeactivated(uint256 indexed eventId);

    constructor(address initialOwner) Ownable(initialOwner) {
        eventCount = 0;
    }

    // Create a new event
    function createEvent(
        string memory name,
        uint256 date,
        uint256 totalTickets,
        uint256 ticketPrice
    ) external onlyOwner {
        require(bytes(name).length > 0, "Event name cannot be empty");
        require(date > block.timestamp, "Event date must be in the future");
        require(totalTickets > 0, "Total tickets must be greater than zero");
        require(ticketPrice > 0, "Ticket price must be greater than zero");

        eventCount++;
        events[eventCount] = Event(name, date, totalTickets, ticketPrice, true);
        emit EventCreated(eventCount, name, ticketPrice);
    }

    // Deactivate an event
    function deactivateEvent(uint256 eventId) external onlyOwner {
        require(eventId > 0 && eventId <= eventCount, "Event does not exist");
        require(events[eventId].active, "Event is not active");
        events[eventId].active = false;
        emit EventDeactivated(eventId);
    }

    // Get event details for validation in other contracts
    function getEvent(uint256 eventId) external view returns (string memory name, uint256 date, uint256 totalTickets, uint256 ticketPrice, bool active) {
        require(eventId > 0 && eventId <= eventCount, "Event does not exist");
        Event memory eventData = events[eventId];
        return (eventData.name, eventData.date, eventData.totalTickets, eventData.ticketPrice, eventData.active);
    }
}