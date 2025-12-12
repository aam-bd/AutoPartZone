import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from the directory containing this file (works regardless of cwd)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") }); // MUST be first
// Debugging: show which .env path was attempted and the loaded value
const resolvedEnvPath = path.join(__dirname, ".env");
console.log("Loading .env from:", resolvedEnvPath);
console.log("dotenv loaded MONGO_URI:", process.env.MONGO_URI ? "(present)" : "(undefined)");

// Import the app after dotenv config so environment variables are available
const { default: app } = await import("./src/app.js");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

