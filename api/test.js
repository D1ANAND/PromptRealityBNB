import axios from 'axios';

async function callCreate(_email) {
    const apiUrl = `${baseUrl}/create`
    const payload = {
        email: _email,
        user_address: addressUser,
        contract_address: addressContract
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function syncMain(_email) {
    const apiUrl = `${baseUrl}/syncPin/${addressContract}/${_email}`
    const response = await axios.post(apiUrl);
    console.log(response)
}

async function fetchMain(_email) {
    const apiUrl = `${baseUrl}/fetchMain/${_email}`
    const response = await axios.get(apiUrl);
    console.log(response)
}

async function fetchMainRunner() {
    const apiUrl = `${baseUrl}/fetchMain/anshsaxena4190@gmail.com`
    const response = await axios.get(apiUrl);
    console.log(response)
}

async function callUpdateContract(_contractAddress) {
    const apiUrl = `${baseUrl}/updateContract`
    const payload = {
        contract_address: _contractAddress
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function callUpdateLatestGeneration(_generation, _email) {
    const apiUrl = `${baseUrl}/updateLatestGeneration`
    const payload = {
        generation: _generation,
        email :_email
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function fetchLatestGeneration(_email) {
    const apiUrl = `${baseUrl}/latestGeneration/${_email}`
    const response = await axios.get(apiUrl);
    console.log(response)
}

export async function generationMeshyAsset(imagePrompt) {
    let modifiedImagePrompt = replaceWhitespaceWithHyphen(imagePrompt)
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/generateassets/${modifiedImagePrompt} ⁠`;
    const response = await axios.get(apiUrl);
    console.log(response.data);
}

function replaceWhitespaceWithHyphen(inputString) {
    return inputString.replace(/\s+/g, '-');
}


let addressContract = "0x9488e8282518a472d27cDaE73b92A0A1B48825B0"

let addressUser = "0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB"

let baseUrl = "https://promptreality.onrender.com"
// let baseUrl = "http://localhost:3080"

async function main() {
    let email = "anshsaxena419@gmail.com"
    let email2 = "test@gmail.com"

    // callUpdateContract(addressContract)
    // callCreate(email)
    // syncMain(email)
    // fetchMain(email)

    callUpdateLatestGeneration("moon", email)
    // callUpdateLatestGeneration("swan", email2)
    // fetchLatestGeneration(email)

    // generationMeshyAsset("green color monster with 3 eyes and 4 legs")
}

main()