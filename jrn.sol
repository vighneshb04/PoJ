// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract JudgementNFT {
    string public name = "JudgementNFT";
    string public symbol = "JNFT";

    uint256 public totalSupply = 0;
    uint256 public royaltyPerCitation = 0.01 ether;

    struct Judgement {
        string court;
        string region;
        string crime;
        string judge;
        string author;
        uint256 citations;
    }

    struct Token {
        address owner;
        string tokenURI;
    }

    mapping(uint256 => Judgement) public judgements;
    mapping(uint256 => Token) public tokens;
    mapping(address => uint256[]) public ownerToTokens;
    mapping(address => uint256) public authorRoyalties;

    event JudgementMinted(
        uint256 indexed tokenId,
        string court,
        string region,
        string crime,
        string judge,
        string author,
        string tokenURI
    );

    event JudgementCited(uint256 indexed tokenId, address indexed citer);
    event RoyaltyWithdrawn(address indexed author, uint256 amount);

    function mintJudgement(
        string memory _court,
        string memory _region,
        string memory _crime,
        string memory _judge,
        string memory _author,
        string memory _tokenURI
    ) public {
        totalSupply++;
        uint256 tokenId = totalSupply;

        judgements[tokenId] = Judgement(_court, _region, _crime, _judge, _author, 0);
        tokens[tokenId] = Token(msg.sender, _tokenURI);
        ownerToTokens[msg.sender].push(tokenId);

        emit JudgementMinted(tokenId, _court, _region, _crime, _judge, _author, _tokenURI);
    }

    function citeJudgement(uint256 tokenId) public payable {
        require(tokenId <= totalSupply, "Invalid tokenId");
        require(msg.value == royaltyPerCitation, "Incorrect royalty fee");

        Judgement storage j = judgements[tokenId];
        j.citations++;

        // Add to the author's royalty balance
        address authorAddress = tokens[tokenId].owner;
        authorRoyalties[authorAddress] += msg.value;

        emit JudgementCited(tokenId, msg.sender);
    }

    function withdrawRoyalties() public {
        uint256 amount = authorRoyalties[msg.sender];
        require(amount > 0, "No royalties to withdraw");

        authorRoyalties[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit RoyaltyWithdrawn(msg.sender, amount);
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        return tokens[tokenId].tokenURI;
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        return tokens[tokenId].owner;
    }

    function balanceOf(address _owner) public view returns (uint256) {
        return ownerToTokens[_owner].length;
    }

    function tokenOfOwnerByIndex(address _owner, uint256 index) public view returns (uint256) {
        require(index < ownerToTokens[_owner].length, "Index out of bounds");
        return ownerToTokens[_owner][index];
    }

    function getJudgement(uint256 tokenId) public view returns (Judgement memory) {
        return judgements[tokenId];
    }
}