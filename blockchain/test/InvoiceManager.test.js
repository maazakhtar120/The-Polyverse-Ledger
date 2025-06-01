const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("InvoiceManager contract", function () {
  let creditScore, invoiceManager;
  let owner, issuer, recipient, other;

  beforeEach(async function () {
  [owner, issuer, recipient, other] = await ethers.getSigners();

  const CreditScore = await ethers.getContractFactory("CreditScore");
  creditScore = await CreditScore.deploy();
  await creditScore.deployed();

  const InvoiceManager = await ethers.getContractFactory("InvoiceManager");
  invoiceManager = await InvoiceManager.deploy(creditScore.address);
  await invoiceManager.deployed();

  await creditScore.setOperator(invoiceManager.address);
});



  it("Should create a new invoice", async function () {
    await expect(invoiceManager.connect(issuer).createInvoice(recipient.address, 1000, 10000))
      .to.emit(invoiceManager, "InvoiceCreated")
      .withArgs(1, issuer.address, recipient.address, 1000, 10000);

    const invoice = await invoiceManager.invoices(1);
    expect(invoice.id).to.equal(1);
    expect(invoice.issuer).to.equal(issuer.address);
    expect(invoice.recipient).to.equal(recipient.address);
    expect(invoice.amount).to.equal(1000);
    expect(invoice.dueDate).to.equal(10000);
    expect(invoice.paid).to.equal(false);
  });

  it("Should allow recipient to mark invoice as paid and call credit scoring", async function () {
    await invoiceManager.connect(issuer).createInvoice(recipient.address, 1000, 10000);

    await expect(invoiceManager.connect(recipient).markInvoicePaid(1))
      .to.emit(invoiceManager, "InvoicePaid")
      .withArgs(1);

    const invoice = await invoiceManager.invoices(1);
    expect(invoice.paid).to.equal(true);

    const score = await creditScore.getScore(recipient.address);
    expect(score).to.be.gt(0); // score increased in CreditScore
  });

  it("Should fail if non-recipient tries to mark invoice as paid", async function () {
    await invoiceManager.connect(issuer).createInvoice(recipient.address, 1000, 10000);
    await expect(invoiceManager.connect(other).markInvoicePaid(1))
      .to.be.revertedWith("Only recipient can mark as paid");
  });

  it("Should fail if invoice already paid", async function () {
    await invoiceManager.connect(issuer).createInvoice(recipient.address, 1000, 10000);
    await invoiceManager.connect(recipient).markInvoicePaid(1);
    await expect(invoiceManager.connect(recipient).markInvoicePaid(1))
      .to.be.revertedWith("Already paid");
  });
});
