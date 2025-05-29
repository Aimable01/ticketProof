// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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

    event EventCreated(uint256 indexed eventId, string name, uint256 ticketPrice);

    function createEvent(string memory name, uint256 date, uint256 totalTickets, uint256 ticketPrice) external onlyOwner {
        eventCount++;
        events[eventCount] = Event(name, date, totalTickets, ticketPrice, true);
        emit EventCreated(eventCount, name, ticketPrice);
    }

    function deactivateEvent(uint256 eventId) external onlyOwner {
        require(events[eventId].active, "Event does not exist");
        events[eventId].active = false;
    }
}