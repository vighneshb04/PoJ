// MintJudgement.js
import React, { useState } from 'react';
import { ethers } from 'ethers';
import { ABI, CONTRACT_ADDRESS } from '../contract/JudgementNFT';
import axios from 'axios';

function MintJudgement() {
  const [wallet, setWallet] = useState(null);
  const [court, setCourt] = useState('');
  const [region, setRegion] = useState('');
  const [crime, setCrime] = useState('');
  const [judge, setJudge] = useState('');
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setWallet(accounts[0]);
    } else {
      alert("MetaMask not detected");
    }
  };

  const handlePDFChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const uploadPDFToPinata = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const data = new FormData();
    data.append('file', file);

    const res = await axios.post(url, data, {
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': `multipart/form-data`,
        Authorization: process.env.REACT_APP_PINATA_JWT
      },
    });

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  };

  const uploadMetadataToPinata = async (pdfCID) => {
    const metadata = {
      name: 'Judgement Record NFT',
      description: 'Tamper-proof legal judgement',
      file: pdfCID,
      attributes: [
        { trait_type: 'Court', value: court },
        { trait_type: 'Region', value: region },
        { trait_type: 'Crime', value: crime },
        { trait_type: 'Judge', value: judge },
      ],
    };

    const res = await axios.post(
      `https://api.pinata.cloud/pinning/pinJSONToIPFS`,
      metadata,
      {
        headers: {
          Authorization: process.env.REACT_APP_PINATA_JWT
        }
      }
    );

    return `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;
  };

  const mintJudgement = async () => {
    if (!pdf || !court || !region || !crime || !judge) {
      return alert("Fill all fields and select a PDF file");
    }

    setLoading(true);
    try {
      const pdfCID = await uploadPDFToPinata(pdf);
      const metadataCID = await uploadMetadataToPinata(pdfCID);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.mintJudgement(court, region, crime, judge, metadataCID);
      await tx.wait();
      alert('Judgement NFT minted!');
    } catch (err) {
      console.error(err);
      alert('Minting failed ❌');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="cyber-main">
      <div className="cyber-card">
        <div className="card-header">
          <div className="header-decoration"></div>
          <h2>Mint New Judgement</h2>
          <div className="header-decoration"></div>
        </div>

        <form className="cyber-form" onSubmit={e => { e.preventDefault(); mintJudgement(); }}>
          <div className="input-group">
            <label>Court</label>
            <input className="cyber-input" value={court} onChange={e => setCourt(e.target.value)} placeholder="Supreme Court" />
          </div>
          <div className="input-group">
            <label>Region</label>
            <input className="cyber-input" value={region} onChange={e => setRegion(e.target.value)} placeholder="Delhi" />
          </div>
          <div className="input-group">
            <label>Crime</label>
            <input className="cyber-input" value={crime} onChange={e => setCrime(e.target.value)} placeholder="Cyber Fraud" />
          </div>
          <div className="input-group">
            <label>Judge</label>
            <input className="cyber-input" value={judge} onChange={e => setJudge(e.target.value)} placeholder="Justice Raman" />
          </div>
          <div className="input-group">
            <label>Upload Judgement PDF</label>
            <input type="file" className="cyber-input" accept="application/pdf" onChange={handlePDFChange} />
          </div>

          <button
            type="submit"
            className={`cyber-button mint-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            <span className="cyber-button-text">{loading ? 'Minting...' : 'Mint NFT'}</span>
            <span className="cyber-button-glitch"></span>
          </button>
        </form>

        <div className="wallet-status">
          <p><strong>Wallet:</strong> {wallet ? wallet : "Not Connected"}</p>
          {!wallet && (
            <button className="cyber-button connect-button" onClick={connectWallet}>
              <span className="cyber-button-text">Connect Wallet</span>
              <span className="cyber-button-glitch"></span>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default MintJudgement;
