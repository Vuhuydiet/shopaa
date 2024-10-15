run 'npm install' after cloning the repos.

1. set up '.env' file as follow:
```env
DB_HOST=localhost
DB_USER=
DB_PASSWORD=
DB_NAME=
DB_PORT=
```

2. set up database:
  - first, 'npm run db' to build the database
  - next, 'npm run db-fn' to build functions

3. set up private/public key for authentication
  - run 'npm run genkey'

see more commands in the 'package.json' file.