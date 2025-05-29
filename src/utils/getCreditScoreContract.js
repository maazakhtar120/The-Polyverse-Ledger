import { ethers } from 'ethers';
import CreditScore from '../abi/CreditScore.json';


const CONTRACT_ADDRESS = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

export function getCreditScoreContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CreditScore.abi, signerOrProvider);
}
