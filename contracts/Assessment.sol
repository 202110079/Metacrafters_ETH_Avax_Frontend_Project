// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount, uint256 fee);
    event Withdraw(uint256 amount, uint256 fee);

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint256 _previousBalance = balance;

        // Ensure only the owner can deposit
        require(msg.sender == owner, "You are not the owner of this account");

        // Calculate the 2% fee
        uint256 fee = (_amount * 2) / 100;
        uint256 netAmount = _amount - fee;

        balance += netAmount;

        assert(balance == _previousBalance + netAmount);

        // Emit the event with amount and fee
        emit Deposit(_amount, fee);
    }

    // Custom error
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint256 _previousBalance = balance;

        // Calculate the 2% fee
        uint256 fee = (_withdrawAmount * 2) / 100;
        uint256 totalDeduction = _withdrawAmount + fee;

        if (balance < totalDeduction) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: totalDeduction
            });
        }

        balance -= totalDeduction;

        assert(balance == (_previousBalance - totalDeduction));

        emit Withdraw(_withdrawAmount, fee);
    }
}
