## StoreRoom

This is a project that implements some of Paystack's StoreFront features using ExpressJS framework.

## Documentation

Check out the [Postman Documentation](https://documenter.getpostman.com/view/11863559/Uyr8nyMs)

## Installation

```bash
$ npm install
```

## Running the app

- Create a `.env` file in the project's directory
- Copy the contents of the `.env.example` into `.env` 
- Edit the variables

```bash
$ npm run dev
```

## Test

```bash
# unit and integration tests
$ npm test

# test coverage
$ npm run test:cov
```

## Docker Support

```bash
$ docker compose -f "docker-compose.yml" up -d --build
```