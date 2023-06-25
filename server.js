import express, { json, urlencoded } from "express";
import { config } from "./config/config.js";
import { connect } from "mongoose";
import cors from "cors";

import { errorHandler } from "./middlewares/errorHandler.js";
import recipesRoutes from "./routes/recipesRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import bodyParser from "body-parser";

const app = express();

//connecting to database
connect(
  "mongodb+srv://ashok:ashok20032001@cluster0.zmvrzcr.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => {
    console.log(`Connected to database : ${config.database.name} successfully`);
  })
  .catch((error) => {
    console.error(
      `Connection to mongoDB unsuccessful!\nerror : ${error.message}`
    );
  });

//middlewares
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));

//routes
app.use("/", authRoutes);
app.use("/user", userRoutes);
app.use("/recipes", recipesRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server connected nice!" });
});

//important to placed after this route to handle errors in above routes
app.use(errorHandler);

//starting express server
app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
