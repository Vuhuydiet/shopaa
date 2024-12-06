import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import path from 'path';
import pg from 'pg';

const { Pool } = pg;

const triggersPath = path.join(import.meta.dirname, 'triggers');
const connectionString = process.env.DATABASE_URL;

async function executeSql() {
  const pool = new Pool({ connectionString });

  try {
    const files = fs.readdirSync(triggersPath);

    for (const file of files) {
      const sql = fs.readFileSync(path.join(triggersPath, file), 'utf-8');
      await pool.query(sql);
      console.log(`Successfully executed SQL from file: ${file}`);
    }
  } catch (err) {
    console.error('Error running init:', err);
  } finally {
    await pool.end();
    console.log('Database connection pool closed.');
  }
}

executeSql().catch((err) => console.error(err));
