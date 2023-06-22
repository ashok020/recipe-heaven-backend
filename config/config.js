import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  database: {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 27017,
    name: process.env.DB_NAME || "test",
    username: process.env.DB_USERNAME || "admin",
    password: process.env.DB_PASSWORD || "password123",
  },
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || "privateKey",
    expireIn: process.env.JWT_EXPIRE_IN || "1d",
  },
  api: {
    chatgpt: {
      apiKey: process.env.CHATGPT_API_KEY,
      url: process.env.CHATGPT_API_URL,
    },
  },
};
