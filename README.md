# Moodly

## Getting started

1. Install the project dependencies using `yarn install`
2. Fill the the .env file with the required values
3. Start a local dev server using `yarn run dev`

## Environment variables

- **JWT_SECRET**: The secret used to encrypt the JWTs used by the app. (Generate it using `openssl rand -hex 64`)
- **DATABASE_URL**: The URL string of a Postgres database. Must start with `postgres://`
