import "dotenv/config";
import { defineConfig } from "prisma/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is missing in .env");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL, // now guaranteed string
  },
});
