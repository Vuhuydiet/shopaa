import dotenv from 'dotenv';
dotenv.config();
import { getPathFromBackend } from '../lib/getPath.js';
import fs from 'fs/promises';

import pkg from 'pg';
const { Client } = pkg;

function getClient(database) {
  return new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: database,
    port: process.env.DB_PORT,

    client_encoding: 'UTF8',
  });
}

async function build(sqlScript = 'models/scripts/database.sql') {
  try {
    console.log(`INFO: reading '${sqlScript}' script file(s)...`);
    const SQL = await fs.readFile(getPathFromBackend(sqlScript), 'utf8');

    console.log('INFO: creating database...');
    const client = getClient('postgres');
    await client.connect();
    await client.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    await client.end();

    console.log('INFO: setting up new database...');
    const newClient = getClient(process.env.DB_NAME);
    await newClient.connect();
    await newClient.query(SQL);
    await newClient.end();

    console.log('INFO: done building database!');
  } catch (err) {
    console.log('ERROR: ', err);
  }
}

build();
