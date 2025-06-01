const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreditScoring contract", function () {
  let CreditScoring;
  let creditScoring;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    CreditScoring = await ethers.getContractFactory("CreditScoring");
    creditScoring = await CreditScoring.deploy();
    // await creditScoring.deployed();
  });

  it("Should set the right owner", async function () {
    expect(await creditScoring.owner()).to.equal(owner.address);
  });

  it("Should allow owner to record invoice and update score", async function () {
    await creditScoring.recordInvoicePayment(user1.address, 500);
    const score = await creditScoring.getScore(user1.address);
    expect(score).to.be.above(300); // should be 300 + some calculated score
  });

  it("Should update invoice and total amount stats", async function () {
    await creditScoring.recordInvoicePayment(user1.address, 500);
    const [invoices, amount] = await creditScoring.getStats(user1.address);
    expect(invoices).to.equal(1);
    expect(amount).to.equal(500);
  });

  it("Should cap the score at 900", async function () {
    for (let i = 0; i < 200; i++) {
      await creditScoring.recordInvoicePayment(user1.address, 1000);
    }
    const score = await creditScoring.getScore(user1.address);
    expect(score).to.equal(900);
  });

  it("Should NOT allow non-owner to record invoice", async function () {
    await expect(
      creditScoring.connect(user1).recordInvoicePayment(user2.address, 200)
    ).to.be.revertedWith("Not authorized");
  });
});
