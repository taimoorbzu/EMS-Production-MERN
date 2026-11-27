import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import User from "../models/User.model.js";
import sendTokenResponse from "../utils/jwtToken.js";
import { clearCookie } from "../utils/jwtToken.js";

export const login = catchAsync(async function (req, res, next) {
    //First check the provided credientials provided User
    if (!req.body?.email || !req.body?.password) {
        return next(new AppError("Please provide email and password", 400));
    }

    //Search user by email
    const user = await User.findOne({ email: req.body.email }).select("+passwordHash")
    if (!user) {
        return next(new AppError("Invalid Email or Password", 401))
    }

    //Check correct password
    const CorrectPassword = await user.comparePassword(req.body.password)
    if (!CorrectPassword) {
        return next(new AppError("Invalid Email or Password", 401))
    }

    //Reject if user is no longer active
    if (!user.isActive) {
        return next(new AppError("This account is no longer active", 403))
    }

    //Saving the Log In time
    user.lastLogin = Date.now();
    await user.save();

    //For Token & Response
    sendTokenResponse(user, 200, "Login Successfully", res);
});

export const logOut = catchAsync(async function (req, res, next) {
    clearCookie(res);
});

export const getMe = catchAsync(async function (req, res, next) {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status: "success",
        data: {
            user
        }
    });
});

export const updatePassword = catchAsync(async function (req, res, next) {
    //1.Check inputs
    if (!req.body?.oldPassword || !req.body?.newPassword || !req.body?.confirmNewPassword) {
        return next(new AppError("Please provide all the required fields", 400));
    }

    //2.Check current Password
    const user = await User.findById(req.user.id).select("+passwordHash");
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const isPasswordCorrect = await user.comparePassword(req.body.oldPassword);
    if (!isPasswordCorrect) {
        return next(new AppError("Incorrect password", 401));
    }

    //2.Update Password and check whether the password and confirm password are same
    if (req.body.newPassword !== req.body.confirmNewPassword) {
        return next(new AppError("New Password and Confirm New Password are not same", 400));
    }
    user.passwordHash = req.body.newPassword;
    await user.save();

    //3.Send Token Response
    sendTokenResponse(user, 200, "Password updated successfully", res);
});