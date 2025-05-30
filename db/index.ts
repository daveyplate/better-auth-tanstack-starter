import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
import * as schema from "../db/schema";
import "dotenv/config";

const pool = new pkg.Pool({
  connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle(pool, { schema });
