import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN, NODE_ENV } from "../config/env.js";

const generateToken = (userID, role) => {
    return jwt.sign({ userID, role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}


export default function sendTokenResponse(user, statusCode, message, res) {
    //First Generate the Token
    const token = generateToken(user._id, user.role);

    //Define the cookieoptions for both dev and prod
    const cookie_options = {
        sameSite: NODE_ENV === "development" ? "lax" : "strict",
        secure: NODE_ENV === "development" ? false : true,
        httpOnly: true,
        maxAge: Number(JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000,
    }

    res.cookie("jwt", token, cookie_options);

    res.status(statusCode).json({
        status: "success",
        message,
        data: {
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin,
            }
        }
    })
}


export const clearCookie = (res) => {
    const cookie_options = {
        sameSite: NODE_ENV === "development" ? "lax" : "strict",
        secure: NODE_ENV === "development" ? false : true,
        httpOnly: true
    }

    //Clear the cookie 
    res.clearCookie("jwt", cookie_options);

    //sending the response
    res.status(200).json({
        status: "success",
        message: "Logout successful"
    });
}