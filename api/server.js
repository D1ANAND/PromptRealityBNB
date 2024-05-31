import express, { json } from "express";
import cors from "cors";
import { fetchURI, updateContractAddress } from "./function.js";

const app = express();
const port = 3080;

app.use(json());

app.use(cors({ origin: true }));

// const allowedOrigins = [
//     "http://localhost:3000",
//     "https:/prompt-reality-78.vercel.app",
// ];

// app.use(
//     cors({
//         origin: function (origin, callback) {
//             // Check if the incoming origin is in the allowedOrigins array
//             if (!origin || allowedOrigins.indexOf(origin) !== -1) {
//                 callback(null, true);
//             } else {
//                 callback(new Error("Not allowed by CORS"));
//             }
//         },
//         methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
//         allowedHeaders: ["Content-Type", "Authorization"],
//     })
// );

let emailList = [];

app.post("/create", (req, res) => {
    const email = req.body.email;
    const user_address = req.body.user_address;
    const contract_address = req.body.contract_address;
    if ((email, user_address, contract_address)) {
        const user = emailList.find(
            (user) =>
                user.email === email &&
                user.contract_address === contract_address
        );
        if (user) {
            res.status(200).json({ message: "User already exist" });
        } else {
            let obj = {
                email: email,
                user_address: user_address,
                contract_address: contract_address,
                assets: [],
                main_url: "",
            };
            emailList.push(obj);
            res.status(200).json({
                message: "Email added successfully",
                emails: emailList,
            });
        }
    } else {
        res.status(400).json({ message: "Failed" });
    }
});

app.post("/syncPin/:contract_address/:email", async (req, res) => {
    const { contract_address, email } = req.params;
    const user = emailList.find(
        (user) =>
            user.email === email && user.contract_address === contract_address
    );
    if (user) {
        try {
            console.log("userAddress: ", user.user_address);
            const uri = await fetchURI(user.user_address);
            console.log(uri)
            user.main_url = uri;
            res.status(200).json({ message: "Pin Synced" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "Request failed" });
        }
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

app.get("/fetchMain/:contract_address/:email", (req, res) => {
    const { contract_address, email } = req.params;
    const user = emailList.find(
        (user) =>
            user.email === email && user.contract_address === contract_address
    );
    if (user) {
        const obj = {
            main_url: user.main_url,
        };
        return res.status(200).json(obj);
    }
    res.status(404).json({ error: "User not found" });
});

app.get("/emails", (req, res) => {
    res.status(200).json(emailList);
});

app.post("/contract", (req, res) => {
    const contract_address = req.body.contract_address;
    if (contract_address) {
        updateContractAddress(contract_address);
    } else {
        res.status(400).json({ message: "Failed" });
    }
});

app.post("/update", (req, res) => {
    const email = req.body.email;
    const asset_url = req.body.asset_url;
    const contract_address = req.body.contract_address;
    if ((email, asset_url, contract_address)) {
        const user = emailList.find(
            (user) =>
                user.email === email &&
                user.contract_address === contract_address
        );
        if (user) {
            user.assets.push(asset_url);
            res.status(200).json({
                message: "Asset updated successfully",
                emails: emailList,
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } else {
        res.status(400).json({ message: "Failed" });
    }
});

app.post("/set", (req, res) => {
    const email = req.body.email;
    const main_url = req.body.main_url;
    const contract_address = req.body.contract_address;
    if ((email, main_url, contract_address)) {
        const user = emailList.find(
            (user) =>
                user.email === email &&
                user.contract_address === contract_address
        );
        if (user) {
            user.main_url = main_url;
            res.status(200).json({
                message: "MainUrl updated successfully",
                emails: emailList,
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } else {
        res.status(400).json({ message: "Failed" });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
