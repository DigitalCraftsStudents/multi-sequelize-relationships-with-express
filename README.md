To run any of the apps:

Go the directory and create a .env

```sh
cd hero-sidekick
cp dist.env .env
```

Fill out the .env file with info from a new ElephantSQL instance.

Then, install the dependencies and populate the database.

```sh
npm i
npx sequelize db:migrate
npx sequelize db:seed:all
```