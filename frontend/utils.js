"use client";
import web3modal from "web3modal";
import { ethers } from "ethers";
import { addressContract, abi } from "./config";
import axios from "axios";

// --------Instances

export async function getContract(providerOrSigner) {
    const modal = new web3modal();
    const connection = await modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const contract = new ethers.Contract(addressContract, abi, provider);
    if (providerOrSigner == true) {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(addressContract, abi, signer);
        return contract;
    }
    return contract;
}

export async function getUserAddress() {
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
    });
    return accounts[0];
}

// --------Write

export async function createAssetOnChain(_promptHash, _email) {
    const contract = await getContract(true);
    // const params = [_promptHash, _email]
    // console.log("params", params)
    let inputsFormat = ["jj", "anshsaxena4190@gmail.com"]
    console.log("inputsFormat", inputsFormat)
    const tx = await contract.apiCallMinAsset(inputsFormat);
    await tx.wait();
    fetchAllAssets();
    console.log("Mint api called");
}

export async function sellAsset(_tokenId, _price) {
    console.log("execution inputs", _tokenId, _price);
    const contract = await getContract(true);
    const weiPrice = ethers.utils.parseUnits(_price.toString(), "ether");
    const tx = await contract.sell(_tokenId, weiPrice);
    await tx.wait();
    console.log("Mint api called");
}

export async function buyAsset(_tokenId, _price) {
    const contract = await getContract(true);
    const weiPrice = ethers.utils.parseUnits(_price.toString(), 18);
    console.log("weiPrice", weiPrice)
    const tx = await contract.buy({
        value: weiPrice,
        gasLimit: 1000000,
    });
    await tx.wait();
    fetchAllAssets();
    console.log("Asset bought");
}

export async function setMain(_tokenId) {
    const contract = await getContract(true);
    const tx = await contract.setMain(_tokenId);
    await tx.wait();
    console.log("Asset pinned");
}

// --------Read

let allAssets = [];

export async function fetchAllAssets() {
    const contract = await getContract(true);
    const data = await contract.fetchAllModels();

    const items = await Promise.all(
        data.map(async (i) => {
            let _price = ethers.utils.formatEther(i.price);
            let item = {
                tokenId: i.tokenId.toNumber(),
                owner: i.owner.toString(),
                creator: i.creator.toString(),
                price: _price,
                isSelling: i.isSelling.toString(),
                uri: i._uri.toString(),
                promptHash: i._promptHash.toString(),
            };
            return item;
        })
    );

    allAssets = items;
    console.log("All Assets fetched: ", items);
    return items;
}

export async function fetchMarketplacePage() {
    if (allAssets.length > 0) {
        const filteredArray = allModels.filter(
            (subarray) => subarray.isSelling == "true"
        );
        return filteredArray;
    } else {
        const data = await fetchAllAssets();
        const filteredArray = data.filter(
            (subarray) => subarray.isSelling == "true"
        );
        return filteredArray;
    }
}

let myAssets = [];

export async function fetchInventoryAssets() {
    const address = await getUserAddress();

    const contract = await getContract(true);
    const data = await contract.fetchInventory(address);

    const items = await Promise.all(
        data.map(async (i) => {
            let _price = ethers.utils.formatEther(i.price);
            let item = {
                tokenId: i.tokenId.toNumber(),
                owner: i.owner.toString(),
                creator: i.creator.toString(),
                price: _price,
                isSelling: i.isSelling.toString(),
                uri: i._uri.toString(),
                promptHash: i._promptHash.toString(),
            };
            return item;
        })
    );

    myAssets = items;
    console.log("Inventory assets fetched: ", items);
    return items;
}

// --------APICall

let baseUrl = "https://promptreality.onrender.com"
// let baseUrl = "http://localhost:3080";

export async function callCreate(_email) {
    const address = await getUserAddress();
    const apiUrl = `${baseUrl}/create`;
    const payload = {
        email: _email,
        contract_address: addressContract,
        user_address: address,
    };
    const response = await axios.post(apiUrl, payload);
    console.log(response.data);
}

export async function callSyncPin(_email) {
    const apiUrl = `${baseUrl}/syncPin/${addressContract}/${_email}`;
    const response = await axios.post(apiUrl);
    console.log(response.data);
}

export async function callFetchMain(_email) {
    const apiUrl = `${baseUrl}/fetchMain/${_email}`;
    const response = await axios.get(apiUrl, payload);
    console.log(response.data);
}

export async function generationMeshyAsset(imagePrompt, _email) {
    let modifiedImagePrompt = replaceWhitespaceWithHyphen(imagePrompt)
    // const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/generateassets/${modifiedImagePrompt} ⁠`;
    // const response = await axios.get(apiUrl);
    const response = {data: {s3_url: "https://bucketforadgen.s3.amazonaws.com/generated_models/018fd7a2-1a31-73d4-83d4-4762eb5c1451.obj"}}
    await updateLatestGeneration(response.data.s3_url, _email)
    console.log(response.data.s3_url);
}

export async function generationDallEAsset(imagePrompt, _email) {
    let modifiedImagePrompt = replaceWhitespaceWithHyphen(imagePrompt)
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/generateassetswithDallE/${modifiedImagePrompt} ⁠`;
    const response = await axios.get(apiUrl);
    console.log(response.data);
    await updateLatestGeneration(response.data.s3_url, _email)
}

function replaceWhitespaceWithHyphen(inputString) {
    return inputString.replace(/\s+/g, '-');
}

async function updateLatestGeneration(_generation, _email) {
    const apiUrl = `${baseUrl}/updateLatestGeneration`
    const payload = {
        generation: _generation,
        email: _email
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response.data)
}