import { Router } from "express";
const router = Router();
import { getDepartmentByID, getAllDepartments, createDepartment, updateDepartment, deleteDepartment } from "../controllers/department.controller.js";
import { protect } from "../middlewares/auth.middleware.js";
import restrictTo from "../middlewares/rbac.middleware.js";

router.route("/").get(protect, getAllDepartments).post(protect, restrictTo("admin", "hr"), createDepartment)
router.route("/:id").get(protect, getDepartmentByID).patch(protect, restrictTo("admin", "hr"), updateDepartment).delete(protect, restrictTo("admin"), deleteDepartment);

export default router;