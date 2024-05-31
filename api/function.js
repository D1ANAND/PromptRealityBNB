import { ethers } from "ethers";

let addressContract =  `0xAc943bC26521e297A0A6193738693f4Ee9Dc33FA`

export async function fetchURI(_userAddress) {
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-amoy.infura.io/v3/2HvD0iID3OjnCRpKjKpqXYMcdRV");
    const contract = new ethers.Contract(addressContract, [
        "function userToMain(address address) public view returns (string)"
    ], provider);

    const uri = await contract.userToMain(_userAddress);
    // console.log(uri);
    return uri
}

export async function updateContractAddress(_address) {
    addressContract = _address;
}

// test()
// async function test() {
//     fetchURI("0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB")
// }
