+ Overview
A Shopee-inspired e-commerce platform built with modern web technologies. It includes features like user authentication, product listings, cart management, order processing, and more. Designed for scalability and efficiency, this project follows best practices in backend development.
•	Technical Stack: 
-	Framework: ExpressJS
-	DBMS: PostgreSQL
-	API Test: Postman
•	Key Features:
-	Authentication: Implemented JWT-based authentication.
-	Sending Verification Email: Using Nodemailer for sending verification emails to users.
-	Storing images: Enhanced Cloudinary for storing images.
-	E-Commerce Flatform Features: Developed features for posting new products, searching for products, orders processing, notifications, report, statistics and more.


+ Steps for building & running:

1. Dependencies: 
- NodeJS & npm:
* Download and install NodeJS & npm: https://www.geeksforgeeks.org/how-to-download-and-install-node-js-and-npm/

- PostgreSQL:
* Download and install PostgreSQL: https://www.w3schools.com/postgresql/postgresql_install.php

2. Before diving into the project:
- Create a database named 'shopaa_db'

3. In project directory ('Source Code/shopaa'):
- Create the '.env' file with the secrets (see in '.env.sample'):
* DATABASE_URL: with this format: "postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>?schema=public"
* EMAIL_USER & EMAIL PASSWORD: google email address and password
* CLOUDINARY_URL: go to https://cloudinary.com and sign up for api key.

4. In the 'frontend' directory:
- Create the '.env' file with the content: 'VITE_API_DOMAIN=http://localhost:3000'

5. Building the Backend:
- Run 'npm install'

- Run 'npm run genkey'

- Run 'npm run prisma:generate'

- Run 'npm run prisma:migrate:dev'

6. Building the Frontend:
- Run 'cd frontend & npm install'
- Building: run 'cd frontend && npm run build'

7. Running in development mode:
- Run 'npm run dev'
- On your browser: go to http://localhost:5173

8. Running in production mode:
- Run 'npm start'
- On your browser: go to http://localhost:3000

