import mysql2 from "mysql2/promise"
import dotenv from "dotenv";

dotenv.config();

const db = mysql2.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "senai",
    database: process.env.DB_DATABASE || "farmacia_db"
});

export default db;