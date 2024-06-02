//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

import "./DataFeeds.sol";
import "./CCIPSend.sol";

import {FunctionsClient} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/FunctionsClient.sol";
import {ConfirmedOwner} from "@chainlink/contracts/src/v0.8/shared/access/ConfirmedOwner.sol";
import {FunctionsRequest} from "@chainlink/contracts/src/v0.8/functions/dev/v1_0_0/libraries/FunctionsRequest.sol";

contract PromptReality is ERC721URIStorage, FunctionsClient, ConfirmedOwner {

    DataFeeds public dataFeeds;
    CCIPSender public ccipSender;

    //data-feeds matic/usd
    address aggregatorAddress = 0x001382149eBa3441043c1c66972b4772963f5D43;

    //CCIP amoy-fuji
    address _routerA = 0x9C32fCB86BF0f4a1A8921a9Fe46de3198bb884B2;
    address _linkA = 0x0Fd9e8d3aF1aaee056EB9e802c3A762a667b1904;
    uint64 _destinationChainSelector = 14767482510784806043;

    //APICall amoy
    address router = 0xC22a79eBA640940ABB6dF0f7982cc119578E11De;
    uint64 subscriptionId = 290;
    bytes32 donID = 0x66756e2d706f6c79676f6e2d616d6f792d310000000000000000000000000000;

    constructor() FunctionsClient(router) ConfirmedOwner(msg.sender) ERC721("MR NFT", "MRNFT") {
        dataFeeds = new DataFeeds(aggregatorAddress);
        ccipSender = new CCIPSender(_routerA, _linkA);
    }

    bool public isFulfilled = true;
    uint public lastRqstTokenId;

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

    function bridge(address _receiver, uint _tokenId) public {
        string memory uri = idToAsset[_tokenId]._uri;
        CCIPMessage.MessageStruct memory message = CCIPMessage.MessageStruct(uri, address(this), _tokenId);
        ccipSender.sendMessage(_destinationChainSelector, _receiver, message);
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

    using FunctionsRequest for FunctionsRequest.Request;

    bytes32 public s_lastRequestId;
    bytes public s_lastResponse;
    bytes public s_lastError;
    
    error UnexpectedRequestID(bytes32 requestId);

    uint32 gasLimit = 300000;

    string APIScript =
        "const email = args[1];"
        "const apiResponse = await Functions.makeHttpRequest({"
        "url: `https://promptreality.onrender.com/latestGeneration/${email}`"
        "});"
        "if (apiResponse.error) {"
        "throw Error('Request failed');"
        "}"
        "const { data } = apiResponse;"
        "return Functions.encodeString(data.generation);";

    function apiCallMinAsset(
        string[] calldata args
    ) public returns (bytes32 requestId) {
        isFulfilled = false;
        lastRqstTokenId = mintAsset(msg.sender, args[0]);
        FunctionsRequest.Request memory req;
        req.initializeRequestForInlineJavaScript(APIScript);
        
        if (args.length > 0) req.setArgs(args);
        s_lastRequestId = _sendRequest(
            req.encodeCBOR(),
            subscriptionId,
            gasLimit,
            donID
        );
        return s_lastRequestId;
    }

    function fulfillRequest(
        bytes32 requestId,
        bytes memory response,
        bytes memory err
    ) internal override {
        setURI(lastRqstTokenId, string(response));
        isFulfilled = true;
    }
}