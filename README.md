# Northcoders News API

This backend is hosted on heroku : https://tom-nc-news.herokuapp.com/

This is the backend for the website NC-News which is a frontend portfolio project I built in react.

This backend is built using PSQL, Node, Express and Jest. To access a list of possible endpoints view the endpoints.json file or send a GET request to the above url at /api/.

Mininum versions of:

Node.js : 16.13.1
Postgresql : 14.1

required to run locally.

# Setup - to run locally

### Clone the repo

Run

```
git clone https://github.com/TWallwin/be-nc-news

```

in the folder you wish to create the git repo file.

Run

```
npm install
```

to install any dependencies.

### Create and seed a local database

Run

```
npm run setup-dbs
npm run seed

```

to create and seed the local development databases. Running setup-dbs will also create a test database.

### Create enviroment variable files

Add the files .env.test and .env.development containing:

```
PGDATABASE=nc_news_test
```

and

```
PGDATABASE=nc_news
```

respectively.

## Running Tests

Husky is installed so tests will be run before every git commit. To run the tests manually use:

```
npm test
```
