import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import getUsers from "./flavortown/getUsers.js";

dotenv.config();

const app = express();
const port = process.env.PORT;
app.use(express.json());

const allowedHosts = process.env.ALLOWED_HOSTS.split(",");
const corsOptions = {
    origin: [allowedHosts],
    methods: "GET,POST"
}

app.use(cors(corsOptions));

app.get("/", (req, res) => { res.status(200).send("Server running!"); });
app.get("/search", (req, res) => {
    const query = req.query.query;
    if (query) {
        getUsers(query, res);
    } else {
        res.status(422).send({"error": "Missing 'query' parameter"});
    }
});

app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});