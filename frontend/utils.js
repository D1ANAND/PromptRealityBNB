"use client";
import web3modal from "web3modal";
import { ethers } from "ethers";
import { addressContract, abi } from "./config";
import axios from "axios"

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
      method: "eth_requestAccounts"
    });
    return accounts[0];
  }

// --------Write

export async function createAsset(email, _tokenUri) {
    const contract = await getContract(true);
    const address = await getUserAddress()
    await callUpdate(email, _tokenUri)
    const tx = await contract.mintAsset(address, _tokenUri);
    await tx.wait();
    fetchAllAssets();
    console.log("Asset minted");
}

export async function sellAsset(_tokenId, _price) {
    const contract = await getContract(true);
    const weiPrice = ethers.utils.parseUnits(_price.toString(), "ether");
    const tx = await contract.sell(_tokenId, weiPrice);
    await tx.wait();
    console.log("Asset minted");
}

export async function buyAsset(_tokenId, _price) {
    const contract = await getContract(true);
    const weiPrice = ethers.utils.parseUnits(_price.toString(), "ether");
    const tx = await contract.buy({
        value: weiPrice,
        gasLimit: 1000000
    });
    await tx.wait();
    fetchAllAssets();
    console.log("Asset minted");
}


// --------Read

let allAssets = [];

async function fetchAllAssets() {
    const contract = await getContract(true);
    const data = await contract.fetchAllModels();
  
    const items = await Promise.all(
      data.map(async (i) => {
        //   const tokenUri = await contract.uri(i.ticketId.toString());
        //   console.log(tokenUri);
        //   const meta = await axios.get(tokenUri);
        let _price = ethers.utils.formatEther(i.price);
        let item = {
          tokenId: i.tokenId.toNumber(),
          owner: i.owner.toString(),
          creator: i.creator.toString(),
          price: _price,
          isSelling: i.isSelling.toString(),
          uri: i._uri.toString()
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
      const filteredArray = allModels.filter((subarray) => subarray.isSelling == "true");
      return filteredArray;
    } else {
      const data = await fetchAllAssets();
      const filteredArray = data.filter(subarray => subarray.isSelling == "true");
      return filteredArray;
    }
  }

let myAssets = [];

export async function fetchInventoryAssets() {
    const address = await getUserAddress()

    const contract = await getContract(true);
    const data = await contract.fetchInventory(address);
  
    const items = await Promise.all(
      data.map(async (i) => {
        //   const tokenUri = await contract.uri(i.ticketId.toString());
        //   console.log(tokenUri);
        //   const meta = await axios.get(tokenUri);
        let _price = ethers.utils.formatEther(i.price);
        let item = {
          tokenId: i.tokenId.toNumber(),
          owner: i.owner.toString(),
          creator: i.creator.toString(),
          price: _price,
          isSelling: i.isSelling.toString(),
          uri: i._uri.toString()
        };
        return item;
      })
    );
  
    myAssets = items;
    console.log("Inventory assets fetched: ", items);
    return items;
}

// --------APICall

export async function callCreate(_email) {
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/create`
    const payload = {
        email: _email
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response.data)
}

export async function callUpdate(_email, _assetUrl) {
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/update`
    const payload = {
        email: _email,
        asset_url: _assetUrl
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response.data)
}

export async function callSetMain(_email, _main_url) {
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/set`
    const payload = {
        email: _email,
        main_url: _main_url
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response.data)
}

export async function callFetchMain(_email) {
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/fetchMain`
    const payload = {
        email: _email
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response.data)
}