# ⚖️ Proof of Justice (PoJ) — The Future of Legal Transparency via NFTs

## 📝 Description

**Proof of Justice (PoJ)** is a decentralized application (DApp) that redefines how legal judgments are recorded and verified. It enables the tokenization of legal case judgments as **NFTs**, ensuring they are **immutable, tamper-proof, transparent**, and stored permanently on a decentralized network.

This project leverages **Ethereum blockchain** and **IPFS** to store both the metadata and original PDF documents of judgments. Every NFT minted carries full case details and links to the original judgment stored on **IPFS via Pinata**.

---



## ⚙️ Features & Functionalities

- ✅ Tokenize legal judgments as **ERC-721 NFTs**
- ✅ Store judgment PDF securely on **IPFS via Pinata**
- ✅ Metadata includes court name, region, case type, judge, and author
- ✅ Mint NFTs to specific legal authorities/parties
- ✅ Publicly verify authenticity and ownership on-chain
- ✅ Access case metadata and documents from the DApp frontend
- ✅ Only **admin/authorized user** can mint or manage NFTs
- ✅ Transparent, decentralized, tamper-proof recordkeeping

---

## 🛠 Tech Stack

| Layer               | Technologies                                                                 |
|---------------------|------------------------------------------------------------------------------|
| **Frontend**        | HTML, CSS, JavaScript                                                        |
| **Smart Contracts** | Solidity (ERC-721 Standard)                                                  |
| **Blockchain**      | Ethereum (Sepolia Testnet)                                                   |
| **Wallet**          | MetaMask                                                                     |
| **IDE**             | Visual Studio Code, Remix IDE                                                |
| **Storage**         | IPFS via Pinata                                                               |
| **Blockchain Bridge** | Web3.js                                                                   |

---

## 🧰 Tools & Dependencies

- [Solidity](https://soliditylang.org/) – Smart contract language
- [Remix IDE](https://remix.ethereum.org/) – Writing, compiling & deploying contracts
- [MetaMask](https://metamask.io/) – Wallet integration
- [Web3.js](https://web3js.readthedocs.io/) – Connect frontend to Ethereum
- [Pinata IPFS](https://www.pinata.cloud/) – Uploading documents and metadata
- [OpenZeppelin](https://docs.openzeppelin.com/contracts/) – ERC-721 standard, access control
- [Pinata SDK](https://www.npmjs.com/package/@pinata/sdk) – Upload metadata to IPFS
- [Visual Studio Code](https://code.visualstudio.com/) – Frontend development

---

## 🔁 Workflow

```text
Step 1: Upload Case Details
→ User fills in case metadata (court, region, judge, author, etc.)
→ Uploads a PDF file of the legal judgment.

Step 2: Store in IPFS via Pinata
→ PDF is uploaded and pinned to IPFS via Pinata
→ Returns a unique content identifier (CID)

Step 3: Mint NFT
→ Admin verifies and mints the judgment as an NFT
→ Metadata + IPFS CID is stored and used as tokenURI

Step 4: Verification
→ Anyone can view the NFT details and open the judgment PDF via IPFS
→ Ensures transparency and traceability
📦 How to Run the Project Locally
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/proof-of-justice.git
cd proof-of-justice
2. Install Dependencies
bash
Copy
Edit
npm install
3. Connect to MetaMask and Sepolia Testnet
Open MetaMask

Add Sepolia Testnet if not already available

Import your account or create a new one

Fund with test ETH via Sepolia Faucet

4. Configure Pinata
Create an account at Pinata

Generate API Key and Secret

Add .env file in root:

env
Copy
Edit
PINATA_API_KEY=your_api_key
PINATA_SECRET_API_KEY=your_secret_key
5. Smart Contract Deployment
Open Remix IDE

Paste your Solidity smart contract

Compile and deploy using Injected Web3 (connected to MetaMask)

Copy the deployed contract address

6. Update Contract Address in Frontend
In your JS file:

javascript
Copy
Edit
const contractAddress = "your_deployed_contract_address_here";
7. Run Frontend
bash
Copy
Edit
npm start
Open http://localhost:3000 to view the DApp in the browser.

📂 Project Structure
bash
Copy
Edit
proof-of-justice/
├── contracts/
│   └── PoJ.sol                  # ERC-721 Smart Contract
├── src/
│   ├── components/              # UI Components
│   ├── utils/                   # Web3 & IPFS functions
│   └── App.js                   # Main React App
├── .env                         # Pinata API Keys
├── package.json
└── README.md
🧪 Testing & Validation
✅ All contracts tested and deployed via Remix IDE

✅ IPFS links verified through returned CID from Pinata

✅ NFT metadata rendered correctly in wallet explorers and DApp

✅ Admin-only minting validated with access control

✅ Conclusion
PoJ (Proof of Justice) is a step toward a transparent legal future, where:

📌 Judgments are immutable

🔐 Legal records are tamper-proof

🌍 Data is decentralized and accessible forever

📜 Ownership and citations are on-chain and traceable

This system paves the way for trustless justice and decentralized governance by ensuring that no legal record is ever lost, altered, or misused again.

👨‍💻 Project Lead:   Vighnesh B AND KeerthanaG2

🔗 GitHub: @vighneshb04, @KeerthanaG2

🌐 LinkedIn 
Vighnesh B : https://www.linkedin.com/in/vighnesh-b-b9391b291/
Keerthana :  https://www.linkedin.com/in/keerthana-sai-gazula-4013b927a/
📃 License
This project is licensed under the MIT License.
