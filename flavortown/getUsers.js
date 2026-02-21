import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export default async function getUsers(query, res) {
    const config = {
        headers: { Authorization: `Bearer ${process.env.FLAVORTOWN_API_KEY}` }
    };

    try {
        const response = await axios.get(`${process.env.FLAVORTOWN_API_URL}/users?query=${query}`, config);
        res.status(200).send(response.data.users);
    } catch (error) {
        console.error(error);
        res.status(500).send({error: "Internal Server Error"});
    }
}