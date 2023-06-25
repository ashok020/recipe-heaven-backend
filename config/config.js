import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  database: {
    name: process.env.DB_NAME || "recipeheaven",
    MONGO_URI:
      process.env.MONGO_URI || "mongodb://localhost:27017/recipeheaven",
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
