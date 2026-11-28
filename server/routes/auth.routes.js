import { Router } from "express";
import { login, logOut, getMe, updatePassword } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import restrictTo from "../middlewares/rbac.middleware.js";
const router = Router();


//We will soon add the protect middleware
router.route("/login").post(login);
router.route("/logout").post(logOut);
router.route("/me").get(protect, getMe);
router.route("/update-password").patch(protect, updatePassword);

export default router;