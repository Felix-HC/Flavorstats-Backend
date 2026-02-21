import express from "express";
import dotenv from "dotenv";
import cors from "cors";

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

app.listen(port, () => {
    console.log(`Express server running on port ${port}`);
});