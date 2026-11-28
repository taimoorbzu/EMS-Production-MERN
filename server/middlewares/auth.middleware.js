import jwt from "jsonwebtoken";
import User from "../models/User.model.js";
import AppError from "../utils/AppError.js";
import catchAsync from "../utils/catchAsync.js";
import { JWT_SECRET } from "../config/env.js"

export const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.cookies && req.cookies.jwt) {
        token = req.cookies.jwt
    }
    else if (req.headers?.authorization && req.headers?.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        return next(new AppError("Unauthorized", 401))
    }

    const decodedToken = jwt.verify(token, JWT_SECRET)

    const user = await User.findById(decodedToken.userID)
    if (!user) {
        return next(new AppError("User Not Found", 401))
    }

    if (!user.isActive) {
        return next(new AppError("Inactive Account", 403))
    }

    req.user = user

    next();
})