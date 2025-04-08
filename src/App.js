import React, { useState } from 'react';
import { ethers } from 'ethers';
import { ABI, CONTRACT_ADDRESS } from './contract/JudgementNFT';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import MyJudgements from './pages/MyJudgements';
import './index.css';

function App() {
  const [wallet, setWallet] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [court, setCourt] = useState('');
  const [region, setRegion] = useState('');
  const [crime, setCrime] = useState('');
  const [judge, setJudge] = useState('');
  const [author, setAuthor] = useState('');
  const [pdf, setPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [citationCount, setCitationCount] = useState(null);
  const [royalties, setRoyalties] = useState(null);


  const PINATA_API_KEY = "ea426c2915a3aeed8d05";
  const PINATA_SECRET_API_KEY = "0334124616f77f66eb3ac68b002eff67ccdc7a8d7aec8038d243d4d7ec0e8ba9";

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAccount = await signer.getAddress();
      const nftContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      setWallet(userAccount);
      setAccount(userAccount);
      setContract(nftContract);
    } else {
      alert("MetaMask not detected");
    }
  };

  const handlePDFChange = (e) => {
    setPdf(e.target.files[0]);
  };

  const mintJudgement = async () => {
    if (!pdf || !account || !contract) {
      alert("Please connect wallet and upload a PDF.");
      return;
    }

    try {
      setLoading(true);

      const pdfFormData = new FormData();
      pdfFormData.append("file", pdf);

      const pdfRes = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", pdfFormData, {
        maxContentLength: "Infinity",
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      });

      const pdfIpfsHash = pdfRes.data.IpfsHash;
      const pdfUrl = `https://gateway.pinata.cloud/ipfs/${pdfIpfsHash}`;

      const metadata = {
        court,
        region,
        crime,
        judge,
        author,
        document: pdfUrl,
      };

      const metadataRes = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", metadata, {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_API_KEY,
        },
      });

      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${metadataRes.data.IpfsHash}`;

      const tx = await contract.mintJudgement(court, region, crime, judge, author, metadataUrl);
      await tx.wait();

      alert("✅ NFT Minted Successfully!");
    } catch (error) {
      console.error("❌ Minting failed:", error);
      alert("❌ NFT not minted, check console.");
    } finally {
      setLoading(false);
    }
  };

  const citeJudgement = async () => {
    const id = document.getElementById("citeId").value;
    if (!id || isNaN(id)) {
      alert("Please enter a valid Token ID.");
      return;
    }
  
    try {
      const tx = await contract.citeJudgement(id, {
        value: ethers.utils.parseEther("0.01"),
      });
      await tx.wait();
      alert("✅ Judgement Cited! Royalty paid.");
  
      // 💡 Fetch updated citation count
      const updated = await contract.getJudgement(id);
      setCitationCount(updated.citations.toString());
    } catch (error) {
      console.error("❌ Citation failed:", error);
      alert("❌ Citation failed, check console.");
    }
  };

  const checkMyRoyalties = async () => {
    try {
      const amount = await contract.authorRoyalties(account);
      setRoyalties(ethers.utils.formatEther(amount));
    } catch (error) {
      console.error("Error checking royalties:", error);
      alert("❌ Couldn't fetch royalties.");
    }
  };
  


  return (
    <Router>
      <div className="cyber-container">
        <div className="cyber-grid-background"></div>

        <header className="cyber-header">
          <div className="logo-container">
            <div className="cyber-logo">NFT</div>
            <div className="cyber-title">Judgement <span className="highlight">DApp -Cypher Sentinals</span></div>
          </div>

          <nav className="nav-links">
            <Link className="cyber-nav-link" to="/">Mint</Link>
            <Link className="cyber-nav-link" to="/my-judgements">My Judgements</Link>
          </nav>

          <div className="wallet-display">
            <div className="wallet-indicator"></div>
            <div className="wallet-address">
              {wallet ? wallet.slice(0, 6) + "..." + wallet.slice(-4) : "Not Connected"}
            </div>
          </div>
          <button className="cyber-button connect-button" onClick={connectWallet}>
            <span className="cyber-button-text">Connect</span>
            <span className="cyber-button-glitch"></span>
          </button>
        </header>

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
                <input className="cyber-input" value={court} onChange={e => setCourt(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Region</label>
                <input className="cyber-input" value={region} onChange={e => setRegion(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Crime</label>
                <input className="cyber-input" value={crime} onChange={e => setCrime(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Judge</label>
                <input className="cyber-input" value={judge} onChange={e => setJudge(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Author</label>
                <input className="cyber-input" value={author} onChange={e => setAuthor(e.target.value)} />
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

            
          

            {citationCount !== null && (
                <div className="cyber-output">📖 Total Citations: {citationCount}</div>
              )}

              <div className="cyber-button-group">
                <button className="cyber-button" onClick={checkMyRoyalties}>
                  <span className="cyber-button-text">Check My Royalties</span>
                  <span className="cyber-button-glitch"></span>
                </button>
              </div>

              {royalties !== null && (
                <div className="cyber-output">💰 You’ve earned: {royalties} ETH</div>
              )}





            <div className="input-group">
              <label>Cite Judgement by Token ID</label>
              <input className="cyber-input" id="citeId" placeholder="Enter Token ID" />
              <button className="cyber-button" onClick={citeJudgement}>
                <span className="cyber-button-text">Cite & Pay</span>
                <span className="cyber-button-glitch"></span>
              </button>
            </div>

            
          </div>
        </main>

        <Routes>
          <Route path="/my-judgements" element={<MyJudgements />} />
        </Routes>

        <footer className="cyber-footer">
          Built with 🛡️ by Keerthana
        </footer>
      </div>
    </Router>
  );
}

export default App;