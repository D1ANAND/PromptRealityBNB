//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./DataFeeds.sol";

contract PromptReality is ERC721URIStorage {

    DataFeeds public dataFeeds;

    //data-feeds ethereum/usd
    address aggregatorAddress = 0x59F1ec1f10bD7eD9B938431086bC1D9e233ECf41;

    constructor() ERC721("MR NFT", "MRNFT") {
        dataFeeds = new DataFeeds(aggregatorAddress);
    }

    struct Asset {
        uint256 tokenId;
        address payable owner;
        address payable creator;
        uint256 price;
        bool isSelling;
        string _uri;
        string _promptHash;
    }
    
    uint public tokenId;
    mapping (uint256 => Asset) public idToAsset;
    mapping (address => string) public userToMain;

    function getPriceInUsd(uint _tokenId) public view returns (uint) {
        uint _amount = idToAsset[_tokenId].price;
        return dataFeeds.calculate(_amount);
    }

    function setMain(uint _tokenId) public {
        Asset memory asset = idToAsset[_tokenId];
        userToMain[msg.sender] = asset._uri;
    }

    function mintAsset(address _to, string memory _promptHash) public returns (uint){
        tokenId++;
        _mint(_to, tokenId);
        idToAsset[tokenId] = Asset(
            tokenId,
            payable(msg.sender),
            payable(msg.sender),
            0,
            false,
            "",
            _promptHash
        );

        return tokenId;
    }

    function setURI(uint _tokenId, string memory _tokenURI) public {
        Asset storage asset = idToAsset[_tokenId];
        asset._uri = _tokenURI;
        _setTokenURI(_tokenId, _tokenURI);
    }

    function sell(uint _tokenId, uint _price) public {
        Asset storage asset = idToAsset[_tokenId];
        asset.isSelling = true;
        asset.price = _price;
    } 

    function buy(uint256 _tokenId) public payable {
        Asset memory asset = idToAsset[_tokenId];
        require(msg.value == asset.price, "");
        require(asset.isSelling == true, "");

        uint256 royalty = (asset.price * 3)/100; // 3% royalties
        uint256 remainingFunds = asset.price - royalty;
        asset.creator.transfer(royalty);
        asset.owner.transfer(remainingFunds);

        payable(asset.creator).transfer(royalty);
        payable(asset.owner).transfer(remainingFunds);

        safeTransferFrom(address(this), msg.sender, tokenId);
        idToAsset[tokenId].owner = payable(msg.sender);
    }

    function fetchAllModels() public view returns (Asset[] memory){
        uint counter = 0;
        uint length = tokenId;
        Asset[] memory models = new Asset[](length);
        for (uint i = 1; i <= length; i++) {
            uint currentId = i;
            Asset storage currentItem = idToAsset[currentId];
            models[counter] = currentItem;
            counter++; 
        }
        return models;
    }

    function fetchInventory(address _user) public view returns (Asset[] memory){
        uint counter = 0;
        uint length;

        for (uint i = 1; i <= tokenId; i++) {
            if (idToAsset[i].owner == _user) {
                length++;
            }
        }

        Asset[] memory models = new Asset[](length);
        for (uint i = 1; i <= tokenId; i++) {
            if (idToAsset[i].owner == _user) {
                uint currentId = i;
                Asset storage currentItem = idToAsset[currentId];
                models[counter] = currentItem;
                counter++;
            }
        }
        return models;
    }

    //args[0] is promptHash
    //args[0] is email
    //args[0] is generationURI
    function apiCallMinAsset(
        string[] calldata args
    ) public {
        uint lastRqstTokenId = mintAsset(msg.sender, args[0]);
        setURI(lastRqstTokenId, string(args[2]));
    }
}