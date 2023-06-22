import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

const expireIn = config.jwt.expireIn;
const secretKey = config.jwt.secretKey;

export function generateJWT(payload) {
  const token = jwt.sign(payload, secretKey, { expiresIn: expireIn });
  console.log("generating jwt for payload: ", payload);
  console.log("generated token: ", token);
  return token;
}

export function validateJWT(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    console.log("decoded token: ", decoded);
    return decoded;
  } catch (err) {
    console.log(err.message);
    return err.name === "TokenExpiredError"
      ? { error: "Token expired" }
      : { error: "Invalid token" };
  }
}
