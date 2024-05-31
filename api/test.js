import axios from 'axios';

// let baseUrl = "${baseUrl}"
let baseUrl = "http://localhost:3080"
let addressContract = "0xAc943bC26521e297A0A6193738693f4Ee9Dc33FA"
let addressUser = "0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB"

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
    const apiUrl = `${baseUrl}/fetchMain/${addressContract}/${_email}`
    const response = await axios.get(apiUrl);
    console.log(response)
}

async function fetchMainRunner() {
    const apiUrl = `${baseUrl}/fetchMain/0xAc943bC26521e297A0A6193738693f4Ee9Dc33FA/anshsaxena4190@gmail.com`
    const response = await axios.get(apiUrl);
    console.log(response)
}


async function callUpdate(_email, _assetUrl) {
    const apiUrl = `${baseUrl}/update`
    const payload = {
        email: _email,
        asset_url: _assetUrl,
        contract_address: addressContract
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function callSetMain(_email, _main_url) {
    const apiUrl = `${baseUrl}/set`
    const payload = {
        email: _email,
        main_url: _main_url,
        contract_address: addressContract
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function fetchTest(_email) {
    const apiUrl = `https://bafybeiatummt4lcbv7wlsv4hxe2trmmui4p6vipbrg4ccuiqwkqnq7iozq.ipfs.dweb.link/GOph_FhWEAAIcxs.jpeg`
    const response = await axios.get(apiUrl);
    console.log(response)
}

async function fetchTest2(_email) {
    const apiUrl = `https://bafybeihcmnjsqk6xf37iyqs3kw5mqwjfdqufp5kfx6bfw4c2u22c2bqgty.ipfs.dweb.link/test.json`
    const response = await axios.get(apiUrl);
    console.log(response.data.data)
}

async function main() {
    let email = "anshsaxena419@gmail.com"
    let asset_url = "haha.com"
    let asset_url2 = "hey.com"

    // callCreate(email)
    // syncMain(email)
    fetchMain(email)
}

main()