import { Router } from "express";
import { login, logOut, getMe, updatePassword } from "../controllers/auth.controller.js";
const router = Router();


//We will soon add the protect middleware
router.route("/login").post(login);
router.route("/logout").post(logOut);
router.route("/me").get(getMe);
router.route("/update-password").patch(updatePassword);

export default router;