// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract EventTicket is ERC721 {
    uint256 private _ticketId;
    address public marketplace;

    struct Ticket {
        uint256 eventId; // ID of the event from EventManager
        string seatNumber; // Seat identifier (e.g., "A12")
        bool isUsed; // Tracks if ticket is used (e.g., scanned at entry)
    }

    mapping(uint256 => Ticket) public tickets;

    // Events for tracking actions
    event TicketMinted(uint256 indexed ticketId, address indexed owner, uint256 eventId, string seatNumber);
    event TicketUsed(uint256 indexed ticketId, uint256 eventId);

    constructor(address _marketplace) ERC721("EventTicket", "TKT") {
        marketplace = _marketplace;
        _ticketId = 0; // Initialize ticket counter
    }

    // Mint a new NFT ticket
    function mintTicket(address to, uint256 eventId, string memory seatNumber) external returns (uint256) {
        require(msg.sender == marketplace, "Only marketplace can mint tickets");
        _ticketId++; // Increment ticket counter
        uint256 ticketId = _ticketId;
        _safeMint(to, ticketId);
        tickets[ticketId] = Ticket(eventId, seatNumber, false);
        emit TicketMinted(ticketId, to, eventId, seatNumber);
        return ticketId;
    }

    // Mark a ticket as used (e.g., at event entry)
    function markUsed(uint256 ticketId) external {
        require(msg.sender == marketplace, "Only marketplace can mark tickets as used");
        require(tickets[ticketId].eventId != 0, "Ticket does not exist");
        tickets[ticketId].isUsed = true;
        emit TicketUsed(ticketId, tickets[ticketId].eventId);
    }
}