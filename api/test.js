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

let addressUser = "0x48e6a467852Fa29710AaaCDB275F85db4Fa420eB"

let addressContract = "0xb2A1B626aC402DBcd3C0A8450091f6F4a64b5fFA"

// let baseUrl = "https://promptreality.onrender.com"
let baseUrl = "http://localhost:3080"

async function main() {
    let email = "anshsaxena419@gmail.com"

    // callUpdateContract(addressContract)
    // callCreate(email)
    // syncMain(email)
    fetchMain(email)
}

main()