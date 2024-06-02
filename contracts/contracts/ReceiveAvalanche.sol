//SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IRouterClient} from "@chainlink/contracts-ccip/src/v0.8/ccip/interfaces/IRouterClient.sol";
import {OwnerIsCreator} from "@chainlink/contracts-ccip/src/v0.8/shared/access/OwnerIsCreator.sol";
import {Client} from "@chainlink/contracts-ccip/src/v0.8/ccip/libraries/Client.sol";
import {CCIPReceiver} from "@chainlink/contracts-ccip/src/v0.8/ccip/applications/CCIPReceiver.sol";
import {IERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@chainlink/contracts-ccip/src/v0.8/vendor/openzeppelin-solidity/v4.8.3/contracts/token/ERC20/utils/SafeERC20.sol";

import "./PromptReality.sol";

contract Receive is CCIPReceiver  {

    IERC20 private s_linkToken;
    PromptReality public promptReality;

    //Avalanche
    address _routerB = 0xF694E193200268f9a4868e4Aa017A0118C9a8177;
    address _linkB = 0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846;

    constructor() CCIPReceiver(_routerB) {
        s_linkToken = IERC20(_linkB);
        promptReality = new PromptReality();
    }

    bytes32 public s_lastReceivedMessageId;
    string public s_lastReceivedNftUri;
    address public s_lastReceivedNftAddress;
    uint256 public s_lastReceivedNftId;

    event MessageReceived(
        bytes32 indexed messageId,
        uint64 indexed sourceChainSelector,
        address sender,
        string text,
        address token,
        uint256 tokenAmount
    );

    function _ccipReceive(
        Client.Any2EVMMessage memory any2EvmMessage
    ) internal override {
        bytes32 messageId = any2EvmMessage.messageId; // fetch the messageId
        uint64 sourceChainSelector = any2EvmMessage.sourceChainSelector; // fetch the source chain identifier (aka selector)
        address sender = abi.decode(any2EvmMessage.sender, (address)); // abi-decoding of the sender address
        CCIPMessage.MessageStruct memory message = abi.decode(any2EvmMessage.data, (CCIPMessage.MessageStruct));
        s_lastReceivedNftUri = message._nftMetadataUri;
        s_lastReceivedNftAddress = message._nftTokenAddress;
        s_lastReceivedNftId = message._nftTokenId; // abi-decoding of the sent string message
    }

    function mintNFT(address _to, string memory _tokenURI) public {
        uint _tokenId = promptReality.mintAsset(_to, "");
        promptReality.setURI(_tokenId, _tokenURI);
    }
}