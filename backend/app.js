import dotenv from 'dotenv';
dotenv.config();
import serveInfo from './lib/getServeInfo.js'

import express from 'express';
const app = express();
import cors from 'cors';

// import routes


// middlewares
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static assets
app.use(express.static(serveInfo.servePath));
app.get('/', (req, res) => {
  res.sendFile(serveInfo.serveIndexPath);
});

// routes

// server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
