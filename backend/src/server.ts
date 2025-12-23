import app from './app.js';
import db from "./db/index.js";

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        await db.getConnection();
        console.log("MySQL connected successfully");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Database connection failed", error);
    }
}

startServer();

