
import AppError from "../utils/AppError.js";

const restrictTo = (...roles) => {
    return (req, res, next) => {

        if (!req.user) {
            return next(new AppError("You are not logged in", 401));
        }

        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    `You don't have permission to access this resource`,
                    403
                )
            );
        }

        // 3. Allow access
        next();
    };
};

export default restrictTo;
