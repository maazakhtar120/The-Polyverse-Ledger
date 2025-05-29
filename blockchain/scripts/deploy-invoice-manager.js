const hre = require("hardhat");

async function main() {
  console.log("📦 Deploying InvoiceManager contract...");

  const creditScoringAddress = "0x236E845943aA11b16509a7a67852451d466Dfa71";

  const InvoiceManager = await hre.ethers.getContractFactory("InvoiceManager");
  const invoiceManager = await InvoiceManager.deploy(creditScoringAddress);

  await invoiceManager.waitForDeployment();

  console.log("✅ InvoiceManager deployed at:", invoiceManager.target);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exit(1);
});

