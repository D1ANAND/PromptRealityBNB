const axios = require('axios');

// let baseUrl = "${baseUrl}"
let baseUrl = "http://localhost:3080"

async function callCreate(_email) {
    const apiUrl = `${baseUrl}/create`
    const payload = {
        email: _email
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function callUpdate(_email, _assetUrl) {
    const apiUrl = `${baseUrl}/update`
    const payload = {
        email: _email,
        asset_url: _assetUrl
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function callSetMain(_email, _main_url) {
    const apiUrl = `${baseUrl}/set`
    const payload = {
        email: _email,
        main_url: _main_url
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function callFetchMain(_email) {
    const apiUrl = `${baseUrl}/fetchMain`
    const payload = {
        email: _email
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function callViewAssets(_email) {
    const apiUrl = `${baseUrl}/view`
    const payload = {
        email: _email
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

async function fetchMain(_email) {
    const apiUrl = `${baseUrl}/fetchMain/${_email}`
    const response = await axios.get(apiUrl);
    console.log(response)
}

async function main() {
    let email = "anshsaxena4190@gmail.com"
    let asset_url = "haha.com"
    let asset_url2 = "hey.com"

    callCreate(email)
    // callUpdate(email, asset_url2)
    // callSetMain(email, asset_url)
    // fetchMain(email)
}

main()