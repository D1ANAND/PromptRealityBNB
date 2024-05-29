import axios from "axios"

async function callCreate(_email) {
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/create`
    const payload = {
        email: _email
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function callUpdate(_email, _assetUrl) {
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/update`
    const payload = {
        email: _email,
        asset_url: _assetUrl
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function callSetMain(_email, _main_url) {
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/set`
    const payload = {
        email: _email,
        main_url: _main_url
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function callFetchMain(_email) {
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/fetchMain`
    const payload = {
        email: _email
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function callViewAssets(_email) {
    const apiUrl = `https://mixed-reality-apis-zvglklnxya-em.a.run.app/view`
    const payload = {
        email: _email
    }
    const response = await axios.post(apiUrl, payload);
    console.log(response)
}

async function main() {
    let email = "a@gmail.com"
    let asset_url = "haha.com"
    let asset_url2 = "haha.com"

    // callCreate(email)
    // callUpdate(email, asset_url2)
    // callSetMain(email, asset_url2)
    // callViewAssets(email)
}

main()