import connectDB from "./src/lib/mongodb.js";

export async function register() {
  console.log("API Endpoint:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Connecting to database...");
  try {
    await connectDB();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}
