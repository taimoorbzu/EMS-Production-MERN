import express from "express";
import morgan from "morgan";
import { NODE_ENV, CLIENT_URL } from "./config/env.js"
import cors from "cors";
import cookieParser from "cookie-parser";

//App initialization here
const app = express();

//MiddleWares Here
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//Log if we are in the development Mode
if (NODE_ENV === 'development') {
  app.use(morgan("dev"));
}

//Default Route for verification of server 
app.get("/", function (req, res) {
  res.status(200).json({
    status: "success",
    message: "Welcome to EMS- A MERN PROJECT Created for Employers",
  });
});
//Health Check
app.get("/api/v1/health", function (req, res) {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
})

//404 if request to a Route that does'nt exists
app.use(function (req, res) {
  res.status(404).json({
    status: "404 Not Found",
    message: "This API route does not exist on our server",
    timestamp: new Date().toISOString(),
  })
});

export default app;
