import dotenv from "dotenv";
import express from "express";
import chalk from "chalk";
import cors from "cors";
import { mongoConnect } from "./src/config/db.js";
import { error } from "./src/middleware/error.js";
import contactRouter from "./src/routes/contact.js";
import auctionRouter from "./src/routes/auction.js";
import authRouter from "./src/routes/auth.js";
import cookieParser from "cookie-parser";
import userAuthRouter from "./src/routes/userAuth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser())

app.use(
  cors({
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:5173", "https://vipin-mern.vercel.app"],
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    exposedHeaders: ["*", "Authorization"],
  })
);


app.get("/", (req, res) => {
  res.send("It Works");
});

app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/auction", auctionRouter )
app.use("/api/v1/auth", authRouter )
app.use("/api/v1/user", userAuthRouter )

app.use(error);
app.listen(PORT, () => {
  console.log(chalk.bgBlue(`Server Listening to PORT ${PORT}`));
  mongoConnect();
});
