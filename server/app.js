import express from "express";
import morgan from "morgan";
import { NODE_ENV, CLIENT_URL } from "./config/env.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorhandler from "./middlewares/error.middleware.js";
import AppError from "./utils/AppError.js";
import AuthRouter from './routes/auth.routes.js';
import DepartmentRouter from './routes/department.routes.js';

//App initialization here
const app = express();

//MiddleWares Here
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

//Log if we are in the development Mode
if (NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Mount Routes
app.use('/api/v1/auth', AuthRouter);
app.use('/api/v1/departments', DepartmentRouter);

//Health Check
app.get("/api/v1/health", function (req, res) {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

//404 if request to a Route that does'nt exists
app.use(function (req, res, next) {
  next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

//Global Error handling Middleware anywhere we call next(err) then this will executed
app.use(errorhandler);

export default app;
