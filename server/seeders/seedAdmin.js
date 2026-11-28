import mongoose from "mongoose";
import { MONGO_URI } from "../config/env.js";
import User from "../models/User.model.js";

const seedAdmin = async function () {
    try {
        // 1. Connect to MongoDB
        await mongoose.connect(MONGO_URI);

        console.log("MongoDB connected successfully");

        // 2. Check if admin already exists
        const existingAdmin = await User.findOne({
            email: "admin@example.com"
        });

        if (existingAdmin) {
            console.log("Admin user already exists");
            return;
        }

        // 3. Create admin user
        const admin = await User.create({
            email: "admin@example.com",
            passwordHash: "admin@123456",
            role: "admin",
            isActive: true
        });

        console.log("Admin user created successfully!");
        console.log({
            id: admin._id,
            email: admin.email,
            role: admin.role
        });

    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exitCode = 1;

    } finally {
        // 4. Close database connection
        await mongoose.connection.close();
    }
};

seedAdmin();
