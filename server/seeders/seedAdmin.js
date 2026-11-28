import mongoose from "mongoose";
import { MONGO_URI, ADMIN_EMAIL, ADMIN_PASSWORD, NODE_ENV } from "../config/env.js";
import User from "../models/User.model.js";

const seedAdmin = async function () {
    try {
        const isProduction = NODE_ENV === "production";

        const adminEmail = ADMIN_EMAIL ||
            (!isProduction ? "admin@example.com" : null);

        const adminPassword = ADMIN_PASSWORD ||
            (!isProduction ? "Admin@123456" : null);

        if (!adminEmail || !adminPassword) {
            throw new Error(
                "Production seeding requires ADMIN_EMAIL and ADMIN_PASSWORD environment variables"
            );
        }

        if (adminPassword.length < 8) {
            throw new Error("Admin password must be at least 8 characters");
        }

        // 2. Connect to MongoDB
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");

        // 3. Check whether admin already exists
        const existingAdmin = await User.findOne({
            email: adminEmail.toLowerCase().trim()
        });

        if (existingAdmin) {
            console.log("Admin user already exists. Skipping seeding.");
            return;
        }

        // 4. Create admin
        const admin = await User.create({
            email: adminEmail,
            passwordHash: adminPassword,
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

        // 5. Handle duplicate-key race condition
        if (error.code === 11000) {
            console.log("Admin already exists. Skipping seeding.");
        } else {
            console.error("Seeding failed:", error.message);
            process.exitCode = 1;
        }

    } finally {
        // 6. Always close database connection
        if (mongoose.connection.readyState !== 0) {
            await mongoose.connection.close();
            console.log("MongoDB connection closed");
        }
    }
};

seedAdmin();
