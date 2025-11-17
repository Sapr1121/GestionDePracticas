import mongoose from "mongoose";
import dotenv from "dotenv";

// Carga las variables de entorno
dotenv.config();

const connectToDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("✅ Connected to MongoDB Atlas successfully!");
    } catch (error) {
        console.error("❌ Database connection error:", error);
        process.exit(1); // Detiene la app si no puede conectar
    }
};

export default connectToDatabase;