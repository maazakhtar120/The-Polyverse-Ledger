const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("UserRegistry contract", function () {
  let userRegistry;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
  
    const UserRegistry = await ethers.getContractFactory("UserRegistry");
    userRegistry = await UserRegistry.deploy(); // <-- IMPORTANT: await here!
    await userRegistry.deployed();
  });
  

  it("Should register a new user", async function () {
    const metadataURI = "https://example.com/user1.json";

    // Call registerUser from user1 account
    await expect(userRegistry.connect(user1).registerUser(metadataURI))
      .to.emit(userRegistry, "UserRegistered")
      .withArgs(user1.address, metadataURI, await getBlockTimestamp());

    // Check if user is registered
    expect(await userRegistry.isRegistered(user1.address)).to.equal(true);

    // Fetch stored user info
    const user = await userRegistry.getUser(user1.address);
    expect(user.wallet).to.equal(user1.address);
    expect(user.metadataURI).to.equal(metadataURI);
  });

  it("Should fail to register twice from same address", async function () {
    const metadataURI = "https://example.com/user1.json";

    // Register first time (should succeed)
    await userRegistry.connect(user1).registerUser(metadataURI);

    // Register second time (should revert)
    await expect(userRegistry.connect(user1).registerUser(metadataURI))
      .to.be.revertedWith("Already registered");
  });

  it("Should update metadata for registered user", async function () {
    const metadataURI = "https://example.com/user1.json";
    const newMetadataURI = "https://example.com/user1-updated.json";

    // Register first
    await userRegistry.connect(user1).registerUser(metadataURI);

    // Update metadata
    await expect(userRegistry.connect(user1).updateMetadata(newMetadataURI))
      .to.emit(userRegistry, "MetadataUpdated")
      .withArgs(user1.address, newMetadataURI);

    // Check metadata updated
    const user = await userRegistry.getUser(user1.address);
    expect(user.metadataURI).to.equal(newMetadataURI);
  });

  it("Should not allow update metadata if not registered", async function () {
    const newMetadataURI = "https://example.com/user2.json";

    await expect(userRegistry.connect(user2).updateMetadata(newMetadataURI))
      .to.be.revertedWith("User not registered");
  });

  it("Should revert getUser for unregistered user", async function () {
    await expect(userRegistry.getUser(user2.address))
      .to.be.revertedWith("User not registered");
  });
});

// Helper function to get the current block timestamp
async function getBlockTimestamp() {
  const blockNum = await ethers.provider.getBlockNumber();
  const block = await ethers.provider.getBlock(blockNum);
  return block.timestamp;
}
