import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getCreditScoreContract } from '../utils/getCreditScoreContract';

const CreditScoreViewer = () => {
  const [creditScore, setCreditScore] = useState<string | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        if (!window.ethereum) {
          alert("Please install MetaMask!");
          return;
        }

        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const userAddress = await signer.getAddress();
        setWallet(userAddress);

        const contract = getCreditScoreContract(signer);
        const score = await contract.getScore(userAddress);

        setCreditScore(score.toString());
      } catch (err) {
        console.error("Failed to load credit score", err);
        setCreditScore("Error");
      }
    };

    fetchScore();
  }, []);

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-semibold mb-4">Your Web3 Credit Score</h2>
      {wallet && <p><strong>Wallet:</strong> {wallet}</p>}
      <p><strong>Score:</strong> {creditScore ?? "Loading..."}</p>
    </div>
  );
};

export default CreditScoreViewer;
