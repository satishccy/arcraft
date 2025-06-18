import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, "../.env") });

if (!process.env.PINATA_JWT || !process.env.FILEBASE_API_TOKEN || !process.env.MNEMONIC) {
  throw new Error("Environment variables are not set");
}

export const PINATA_JWT = process.env.PINATA_JWT;
export const FILEBASE_API_TOKEN = process.env.FILEBASE_API_TOKEN;
export const MNEMONIC = process.env.MNEMONIC;
