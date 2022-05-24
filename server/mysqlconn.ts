import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const conn = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
})