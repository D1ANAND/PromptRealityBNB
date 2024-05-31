const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const port = 3080;

app.use(bodyParser.json());

const allowedOrigins = ['http://localhost:3000', 'https:/prompt-reality-78.vercel.app'];

app.use(cors({
    origin: function (origin, callback) {
        // Check if the incoming origin is in the allowedOrigins array
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

let emailList = [];

app.post("/create", (req, res) => {
    const email = req.body.email;
    if (email) {
        const user = emailList.find((user) => user.email === email);
        if (user) {
            res.status(200).json({ message: "User already exist" });
        }
        else {
            let obj = {
                email: email,
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

app.post("/update", (req, res) => {
    const email = req.body.email;
    const asset_url = req.body.asset_url;
    if ((email, asset_url)) {
        const user = emailList.find((user) => user.email === email);
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
    if ((email, main_url)) {
        const user = emailList.find((user) => user.email === email);
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

app.get('/fetchMain/:email', (req, res) => {
    const { email } = req.params;
    const user = emailList.find((user) => user.email === email);
    const obj = {
        main_url: user.main_url,
    };
    res.status(200).json(obj);
});

app.get('/emails', (req, res) => {
    res.status(200).json(emailList);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
