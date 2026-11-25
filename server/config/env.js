import dotenv from "dotenv";
dotenv.config();

const requiredVariables = ["MONGO_URI", "PORT", "JWT_SECRET", "CLIENT_URL"];
const missingVariables = requiredVariables.filter(
  (key) => !process.env[key]?.trim(),
);

if (missingVariables.length > 0) {
  throw new Error(
    `Missing environment variables: ${missingVariables.join(", ")}`,
  );
}

if (!/^mongodb(\+srv)?:\/\//.test(process.env.MONGO_URI)) {
  throw new Error("MONGO_URI must start with 'mongodb://' or 'mongodb+srv://'");
}

export const { NODE_ENV, PORT, MONGO_URI, CLIENT_URL, JWT_SECRET } =
  process.env;
