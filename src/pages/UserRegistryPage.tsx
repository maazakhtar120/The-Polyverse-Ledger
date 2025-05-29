// src/pages/UserRegistryPage.tsx
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { getUserRegistryContract } from '../utils/getUserRegistryContract';

const UserRegistryPage = () => {
  const [wallet, setWallet] = useState('');
  const [metadata, setMetadata] = useState('');
  const [registeredUser, setRegisteredUser] = useState<any>(null);
  const [newMetadata, setNewMetadata] = useState('');

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) return alert("Please install MetaMask");

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setWallet(userAddress);

      const contract = getUserRegistryContract(signer);
      const isUser = await contract.isRegistered(userAddress);

      if (isUser) {
        const data = await contract.getUser(userAddress);
        setRegisteredUser({
          wallet: data.wallet,
          metadataURI: data.metadataURI,
          registeredAt: new Date(data.registeredAt.toNumber() * 1000).toLocaleString()
        });
      }
    };

    init();
  }, []);

  const handleRegister = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getUserRegistryContract(signer);

      const tx = await contract.registerUser(metadata);
      await tx.wait();
      alert("✅ Registered successfully. Refresh to view info.");
    } catch (err) {
      console.error(err);
      alert("❌ Registration failed");
    }
  };

  const handleUpdate = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getUserRegistryContract(signer);

      const tx = await contract.updateMetadata(newMetadata);
      await tx.wait();
      alert("✅ Metadata updated. Refresh to view new info.");
    } catch (err) {
      console.error(err);
      alert("❌ Update failed");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-xl font-bold mb-4">🧾 User Registry</h2>
      <p><strong>Connected Wallet:</strong> {wallet}</p>

      {registeredUser ? (
        <div className="mt-4">
          <p><strong>Metadata URI:</strong> {registeredUser.metadataURI}</p>
          <p><strong>Registered At:</strong> {registeredUser.registeredAt}</p>

          <div className="mt-4">
            <input
              type="text"
              placeholder="New metadata URI"
              value={newMetadata}
              onChange={(e) => setNewMetadata(e.target.value)}
              className="border p-2 rounded w-full"
            />
            <button onClick={handleUpdate} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Update Metadata
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Metadata URI (e.g. IPFS CID)"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button onClick={handleRegister} className="mt-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Register Identity
          </button>
        </div>
      )}
    </div>
  );
};

export default UserRegistryPage;
