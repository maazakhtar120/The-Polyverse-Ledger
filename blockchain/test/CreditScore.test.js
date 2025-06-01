const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CreditScore contract", function () {
  let CreditScore, creditScore, owner, operator, addr1;

  beforeEach(async function () {
    CreditScore = await ethers.getContractFactory("CreditScore");
    [owner, operator, addr1, ...addrs] = await ethers.getSigners();
    creditScore = await CreditScore.deploy();
    // await creditScore.deployed();  <-- remove this line
  });

  it("Should set the right owner and operator initially", async function () {
    expect(await creditScore.owner()).to.equal(owner.address);
    expect(await creditScore.operator()).to.equal(owner.address);
  });

  it("Owner can update operator", async function () {
    await creditScore.setOperator(operator.address);
    expect(await creditScore.operator()).to.equal(operator.address);
  });

  it("Non-owner cannot update operator", async function () {
    await expect(
      creditScore.connect(addr1).setOperator(operator.address)
    ).to.be.revertedWith("Only owner can set operator");
  });

  it("Owner or operator can set score", async function () {
    await creditScore.setScore(addr1.address, 100);
    expect(await creditScore.getScore(addr1.address)).to.equal(100);

    await creditScore.setOperator(operator.address);
    await creditScore.connect(operator).setScore(addr1.address, 200);
    expect(await creditScore.getScore(addr1.address)).to.equal(200);
  });

  it("Non-owner/operator cannot set score", async function () {
    await expect(
      creditScore.connect(addr1).setScore(addr1.address, 300)
    ).to.be.revertedWith("Not authorized");
  });

  it("Owner or operator can increase score", async function () {
    await creditScore.setScore(addr1.address, 50);
    await creditScore.increaseScore(addr1.address, 30);
    expect(await creditScore.getScore(addr1.address)).to.equal(80);

    await creditScore.setOperator(operator.address);
    await creditScore.connect(operator).increaseScore(addr1.address, 20);
    expect(await creditScore.getScore(addr1.address)).to.equal(100);
  });

  it("Owner or operator can decrease score", async function () {
    await creditScore.setScore(addr1.address, 100);
    await creditScore.decreaseScore(addr1.address, 40);
    expect(await creditScore.getScore(addr1.address)).to.equal(60);

    await creditScore.setOperator(operator.address);
    await creditScore.connect(operator).decreaseScore(addr1.address, 70);
    expect(await creditScore.getScore(addr1.address)).to.equal(0);
  });

  it("Non-owner/operator cannot increase or decrease score", async function () {
    await expect(
      creditScore.connect(addr1).increaseScore(addr1.address, 10)
    ).to.be.revertedWith("Not authorized");

    await expect(
      creditScore.connect(addr1).decreaseScore(addr1.address, 10)
    ).to.be.revertedWith("Not authorized");
  });
});
