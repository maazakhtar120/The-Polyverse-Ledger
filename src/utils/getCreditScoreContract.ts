import { ethers } from "ethers";
import CreditScoreABI from "../abi/CreditScore.json";

// Replace this with your actual deployed CreditScore contract address
const contractAddress = "0x2b51954D8428d10250709141A0BBDaf7d36B01BE";

export const getCreditScoreContract = (signerOrProvider: any) => {
  return new ethers.Contract(contractAddress, CreditScoreABI.abi, signerOrProvider);
};
