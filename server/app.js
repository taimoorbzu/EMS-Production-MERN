import express from "express";
import morgan from "morgan";
import { NODE_ENV, CLIENT_URL } from "./config/env.js"
import cors from "cors";

//App initialization here
const app = express();

//MiddleWares Here
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());


if (NODE_ENV === 'development') {
  app.use(morgan("dev"));
}

//Default Route to Test Connectivity
app.get("/", function (req, res) {
  res.status(200).json({
    status: "success",
    message: "Welcome to EMS- A MERN PROJECT Created for Employers",
  });
});


export default app;
