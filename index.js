import express, { json } from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import fs from "fs";
const swaggerDocument = JSON.parse(fs.readFileSync("./swagger-output.json", "utf8"));

import pool from "./src/db/index.js";
import logger from "./src/utils/logger.js";

import expenseRoutes from "./src/routes/expenseRoutes.js";
import groupRoutes from "./src/routes/groupsRoutes.js";
import friendRoutes from "./src/routes/friendRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import categoriesRoutes from "./src/routes/categoriesRoutes.js";
import usersRoutes from "./src/routes/usersRoutes.js";

import errorHandler from "./src/middleware/errorHandler.js";
import notFound from "./src/errors/notFound.js";

config({ path: `.env.${process.env.NODE_ENV || "development"}` });

const app = express();

const ACCEPTED_ORIGIN = [
  "https://paysincapp.netlify.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || ACCEPTED_ORIGIN.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.set('trust proxy', 1);
app.use(cors(corsOptions));
app.use(json());
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // max requests per IP
});

app.use(limiter);

app.get("/", (req, res) => {
  logger.info("GET / endpoint hit");
  res.json({ message: "PaySinc API running with PostgreSQL!" });
});

app.use("/api/expenses", expenseRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/friends", friendRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/users", usersRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
