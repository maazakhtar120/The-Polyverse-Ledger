import { ethers } from "ethers";
import InvoiceManagerAbi from "../abi/InvoiceManager.json";

const CONTRACT_ADDRESS = "0x404512E65Cd30015e1CC5E867cdd916626c7C625"; // ✅ Your SKALE InvoiceManager address

export const getInvoiceManagerContract = (
  signerOrProvider: ethers.Provider | ethers.Signer
) => {
  return new ethers.Contract(CONTRACT_ADDRESS, InvoiceManagerAbi.abi, signerOrProvider);
};

