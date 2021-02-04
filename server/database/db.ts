import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const db = new Pool({
    user: process.env['DATABASE_USER'],
    host: process.env['DATABASE_HOST'],
    database: process.env['DATABASE_NAME'],
    password: process.env['DATABASE_PASSWORD'],
    port: 5432,
    ssl: true,
});
