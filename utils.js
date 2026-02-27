import axios from "axios";

export async function toBase64(url) {
    const content = await axios.get(url, { responseType: "arraybuffer" });
    const contentBase64 = Buffer.from(content.data).toString("base64");
    const contentType = content.headers["content-type"];

    return {
         base64: contentBase64,
         contentType: contentType
    };
}