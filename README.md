run 'npm install' after cloning the repos.

1. set up '.env' file as follow:

```env
DATABASE_URL="postgresql://<USER>:<PASSWORD>@<HOST>:<PORT>/<DB_NAME>?schema=public"
```

2. set up database:

- create a database <DB_NAME> in your local machine.
- run 'npm run prisma:generate'
- run 'npm run prisma:migrate:dev'

see more commands in the 'package.json' file.
