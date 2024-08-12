// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

contract Counter {
    uint256 public number;
    uint256 public constant MAX_NUMBER = 100;

    event NumberSet(uint256 newNumber);
    event NumberIncremented(uint256 incrementedNumber);
    event EventEmitted(uint256 indexed topic1, address indexed topic2, string topic3);
    error NumberTooBig();

    function set(uint256 newNumber) public {
        number = newNumber;
        emit NumberSet(newNumber);
        require(newNumber <= MAX_NUMBER, "Counter: number too big");
    }

    function increment() public {
        number++;
        emit NumberIncremented(number);
    }

    function emitEvent(uint256 topic1, address topic2, string memory topic3) public {
        emit EventEmitted(topic1, topic2, topic3);
        revert NumberTooBig();
    }
}
