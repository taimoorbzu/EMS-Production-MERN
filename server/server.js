import app from "./app.js";
import { PORT } from "./config/env.js"
import connectDB from "./config/db.js"

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        })

    } catch (err) {
        console.error("Failed to connect to database:", err.message);
        process.exit(1);
    }
};

startServer();
