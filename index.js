import dotenv from "dotenv";
import express, { urlencoded } from "express";
import chalk from "chalk";
import cors from "cors";
import { mongoConnect } from "./src/config/db.js";
import { error } from "./src/middleware/error.js";
import contactRouter from "./src/routes/contact.js";
import auctionRouter from "./src/routes/auction.js";
import authRouter from "./src/routes/auth.js";
import cookieParser from "cookie-parser";
import userAuthRouter from "./src/routes/userAuth.js";
import newsRouter from "./src/routes/news.js";
import { orderRouter } from "./src/routes/order.js";
import { serviceRoutes } from "./src/routes/services.js";
import morgan from "morgan";
import { paymentRouter } from "./src/routes/payment.js";
import bannerRouter from "./src/routes/banner.js";
import adRouter from "./src/routes/ad.js";
import adminContactRouter from "./src/routes/adminContact.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limits: "50mb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:5173",
      "https://vipin-mern.vercel.app",
      "https://vipin-admin.vercel.app",
      "https://sdlk.in",
      "https://admin.sdlk.in",
    ],
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
    // exposedHeaders: ["*", "Authorization"],
  })
);

app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("It Works");
});

app.use("/api/v1/contact", contactRouter);
app.use("/api/v1/adminContact", adminContactRouter);
app.use("/api/v1/auction", auctionRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userAuthRouter);
app.use("/api/v1/news", newsRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/services", serviceRoutes);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/banner", bannerRouter);
app.use("/api/v1/ad", adRouter);
app.use(error);
app.listen(PORT, () => {
  console.log(chalk.bgBlue(`Server Listening to PORT ${PORT}`));
  mongoConnect();
});
