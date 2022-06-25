# Moodly

## Getting started

1. Install the project dependencies using `yarn install`
2. Fill the the .env file with the required values
3. Start a local dev server using `yarn run dev`

## Environment variables

- **JWT_SECRET**: The secret used to encrypt the JWTs used by the app. (Generate it using `openssl rand -hex 64`)
- **DATABASE_URL**: The URL string of a Postgres database. Must start with `postgres://`
- **BASE_URL**/**NEXT_PUBLIC_BASE_URL**: The base URL of the application
- **SMTP_SENDER**: The sender email address
- **SMTP_HOST**: The SMTP host
- **SMTP_PORT**: The SMTP port
- **SMTP_TLS**: Whether you want to use TLS for your SMTP configuration
- **SMTP_USER**: The user of the SMTP server
- **SMTP_PASSWORD**: The password of the SMTP server
