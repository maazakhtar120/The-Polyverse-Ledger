// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockCreditScoring {
    event RecordCalled(address indexed user, uint amount, uint timestamp);

    function recordInvoicePayment(address user, uint amount, uint paidTimestamp) external {
        emit RecordCalled(user, amount, paidTimestamp);
    }
}
