// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EventTicket is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _ticketIds;

    struct Ticket {
        uint256 eventId;
        string seatNumber;
        bool isUsed;
    }

    mapping(uint256 => Ticket) public tickets;
    address public marketplace;

    constructor(address _marketplace) ERC721("EventTicket", "TKT") {
        marketplace = _marketplace;
    }

    function mintTicket(address to, uint256 eventId, string memory seatNumber) external returns (uint256) {
        require(msg.sender == marketplace, "Only marketplace can mint");
        _ticketIds.increment();
        uint256 ticketId = _ticketIds.current();
        _safeMint(to, ticketId);
        tickets[ticketId] = Ticket(eventId, seatNumber, false);
        return ticketId;
    }

    function markUsed(uint256 ticketId) external {
        require(msg.sender == marketplace, "Only marketplace can mark used");
        require(tickets[ticketId].eventId != 0, "Ticket does not exist");
        tickets[ticketId].isUsed = true;
    }
}