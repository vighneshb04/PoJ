import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ABI, CONTRACT_ADDRESS } from '../contract/JudgementNFT';
import axios from 'axios';

const MyJudgements = () => {
  const [judgements, setJudgements] = useState([]);
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        if (!window.ethereum) return alert("MetaMask not detected");

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setWallet(address);

        console.log("Connected wallet address:", address);

        const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        const balance = await contract.balanceOf(address);
        console.log("NFT Balance:", balance.toString());

        let userJudgements = [];

        for (let i = 0; i < balance; i++) {
          try {
            const tokenId = await contract.tokenOfOwnerByIndex(address, i);
            const uri = await contract.tokenURI(tokenId);
            const onChain = await contract.getJudgement(tokenId);
            const { data } = await axios.get(uri);

            userJudgements.push({
              tokenId: tokenId.toString(),
              metadata: data,
              onChain
            });
          } catch (err) {
            console.error(`Error fetching token at index ${i}:`, err);
          }
        }

        setJudgements(userJudgements);
      } catch (error) {
        console.error("❌ Error fetching NFTs:", error);
        alert("An error occurred while fetching your judgements. Check console for details.");
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div className="cyber-card">
      <div className="card-header">
        <div className="header-decoration"></div>
        <h2>My Judgements</h2>
        <div className="header-decoration"></div>
      </div>
      <div className="cyber-form">
        {judgements.length === 0 ? (
          <p>No NFTs found for this wallet: {wallet}</p>
        ) : (
          <div className="judgement-grid">
            {judgements.map(({ tokenId, metadata, onChain }) => (
              <div key={tokenId} className="judgement-item">
                <h3>🧾 Token #{tokenId}</h3>
                <p><strong>Court:</strong> {onChain.court}</p>
                <p><strong>Region:</strong> {onChain.region}</p>
                <p><strong>Crime:</strong> {onChain.crime}</p>
                <p><strong>Judge:</strong> {onChain.judge}</p>
                <a
                  href={metadata.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cyber-button view-btn"
                >
                  View Judgement PDF
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJudgements;