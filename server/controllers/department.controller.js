import Department from "../models/Department.model.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";
import mongoose from "mongoose";

export const getAllDepartments = catchAsync(async function (req, res, next) {
    const departments = await Department.find().sort({
        name: 1
    })

    res.status(200).json({
        status: "success",
        length: departments.length,
        data: {
            departments
        }
    });
})

export const getDepartmentByID = catchAsync(async function (req, res, next) {
    const { id } = req.params;

    const department = await Department.findById(id)

    if (!department) {
        return next(new AppError("No Matching Record Found", 404))
    }

    res.status(200).json({
        status: "success",
        data: {
            department
        }
    });
})

export const createDepartment = catchAsync(async function (req, res, next) {
    const { name, code, headId, budget, description } = req.body || {};

    const department = await Department.create({
        name,
        code,
        headId,
        budget,
        description,
    });

    res.status(201).json({
        status: "success",
        message: "Department successfully created",
        data: { department },
    });
});

export const updateDepartment = catchAsync(async function (req, res, next) {
    const { id } = req.params;
    const allowedFields = ["name", "code", "budget", "description", "headId"];
    const updateData = {};

    //we whitelist the fields that are allowed to be updated
    for (const field of allowedFields) {
        if (Object.prototype.hasOwnProperty.call(req.body || {}, field)) {
            updateData[field] = req.body[field];
        }
    }

    //prevent empty update request
    if (Object.keys(updateData).length === 0) {
        return next(
            new AppError("Please provide at least one field to update", 400)
        );
    }

    // 4. Update department
    const department = await Department.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
            new: true,
            runValidators: true
        }
    );

    // 5. Check whether department exists
    if (!department) {
        return next(
            new AppError("No matching department found", 404)
        );
    }

    // 6. Send response
    res.status(200).json({
        status: "success",
        message: "Department successfully updated",
        data: {
            department
        }
    });
});

export const deleteDepartment = catchAsync(async function (req, res, next) {
    const { id } = req.params;

    // 1. Find the department
    const department = await Department.findById(id);

    if (!department) {
        return next(new AppError("Department not found", 404));
    }

    // 2. Check whether the Employee model is registered
    const Employee = mongoose.models.Employee;

    if (Employee) {
        // 3. Check whether active employees are assigned
        const hasActiveEmployees = await Employee.exists({
            departmentId: department._id,
            deletedAt: null,
        });

        if (hasActiveEmployees) {
            return next(
                new AppError(
                    "Cannot delete department because active employees are assigned to it",
                    409
                )
            );
        }
    }

    // 4. Delete department
    await Department.deleteOne({ _id: department._id });

    // 5. Send response
    res.status(200).json({
        status: "success",
        message: "Department successfully deleted",
    });
});

