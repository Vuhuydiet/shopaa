import dotenv from 'dotenv';
dotenv.config();

import { Pool } from 'pg';
import client_encoding from 'pg/lib/defaults';

export default new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  client_encoding: 'UTF8',
});
