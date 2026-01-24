import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import { inngest, functions } from "./inngest/index.js";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import storyRouter from "./routes/storyRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();

await connectDB();

app.use(express.json());

// CORS configuration to allow frontend origins
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://pingup-1e51.vercel.app",
    process.env.FRONTEND_URL, // Allow the FRONTEND_URL from .env
  ].filter(Boolean), // Remove undefined/null values
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(clerkMiddleware());

app.get("/", (req, res) => res.send("Server is Running"));
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () =>
  console.log(`Server is running on port http://localhost:${PORT}`)
);

// inggest -> apps -> sync -> https://ping-up-sable-beta.vercel.app/api/inggest

// clerk -> configue -> webhooks -> endpoints -> dropdown webhook -> ingest -> connect to inggest -> approve
