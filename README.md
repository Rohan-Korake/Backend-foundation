<p align="center">
  <img src="./public/images/icon.svg" width="15%" />
</p>

<h1 align="center"><b>Backend Foundation</b></h1>

<p align="center">
<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E" />
<img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" />
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
<img src="https://img.shields.io/badge/bcrypt-003A70?style=for-the-badge&logo=keybase&logoColor=white" />
<img src="https://img.shields.io/badge/Nodemailer-2C3E50?style=for-the-badge&logo=gmail&logoColor=white" />
<img src="https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white" />
<img src="https://img.shields.io/badge/ImageKit-FF6B00?style=for-the-badge&logo=cloudflare&logoColor=white" />
<img src="https://img.shields.io/badge/Resend-000000?style=for-the-badge&logo=gmail&logoColor=EA4335" />
</p>

Backend Foundation is my personal backend learning repository where I document and practice core backend development concepts by building real-world projects using Node.js, Express.js, and MongoDB. This repository tracks my journey of learning server-side development, authentication, APIs, database integration, and scalable backend architecture.

---

---

## Terminal-Based Project Setup

Follow these terminal commands to set up the initial backend project structure from scratch.

### Step 1: Create the project folder and move into it

```bash
mkdir backend-foundation && \
cd backend-foundation
```

---

### Step 2: Initialize the Node.js project and generate `package.json`

```bash
npm init
```

---

### Step 3: Install Prettier as a development dependency

```bash
npm install --save-dev --save-exact prettier
```

---

### Step 4: Create the complete project folder structure in a single command

```bash
mkdir public src && \
mkdir public/images && \
cd src && \
mkdir controllers models routes middlewares utils db validators && \
touch app.js index.js && \
touch controllers/.gitkeep models/.gitkeep routes/.gitkeep middlewares/.gitkeep utils/.gitkeep db/.gitkeep validators/.gitkeep && \
cd .. && \
touch public/images/.gitkeep .env .gitignore .prettierrc .prettierignore
```

---

### Step 5: Configure `.gitignore`

```bash
node_modules/
.env
.vscode/
.DS_Store
dist/
```

---

### Step 6: Configure `.prettierrc`

```bash
{
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "all",
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

---

### Step 7: Configure `.prettierignore`

```bash
node_modules
dist
.env
package-lock.json
```

---

## Project Structure

![Backend Structure](./public/images/backend-structure.png)

---

---

## Installing Required Dependencies

Install dotenv to manage environment variables from a `.env` file.

```bash
npm i dotenv
```

---

Install nodemon to automatically restart the server when file changes are detected.

```bash
npm i nodemon
```

---

Installs Express framework for building backend APIs and handling routes.

```bash
npm i express
```

---

Enables CORS for handling cross-origin requests.

```bash
npm i cors
```

---

Installs Mongoose for interacting with MongoDB using schemas and models.

```bash
npm i mongoose
```

---

Installs bcrypt for hashing and securing user passwords.

```bash
npm i bcrypt
```

---

Installs JSON Web Token for authentication and secure token generation.

```bash
npm i jsonwebtoken
```

---

Provides cryptographic functionality for hashing, encryption, and secure token generation.

```bash
npm i crypto
```

---

Installs Nodemailer for sending emails from the application.

```bash
npm i nodemailer
```

---

Installs Mailgen for generating beautiful email templates.

```bash
npm i mailgen
```

---

Installs express-validator for validating and sanitizing incoming request data.

```bash
npm i express-validator
```

---

Installs cookie-parser for parsing cookies from incoming client requests.

```bash
npm i cookie-parser
```

---

Installs Resend for handling and sending transactional emails.

```bash
npm install resend
```

---

---

## API Documentation

### Content Type

All request bodies must use:

```http
Content-Type: application/json
```

### `POST auth/register`

**Request Body:**

```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "TestPass123"
}
```

---

### `POST auth/verify-email`

Verify a user's email address using the verification token and email received through the URL parameters

**Request Body:**

```json
{
  "verificationToken:": "EMAIL_VERIFICATION_TOKEN"
}
```

---

### `POST auth/resend-email-verification`

Send a new email verification link by using the expired token and email received through the URL parameters when the previous verification token has expired.
**Request Body:**

```json
{
  "expiredToken": "EXPIRED_TOKEN",
  "email": "testuser@example.com"
}
```

---

### `POST /auth/login`

**Request Body:**

```json
{
  "username": "testuser",
  "email": "testuser@example.com",
  "password": "TestPass123"
}
```

---

### `POST /auth/forgot-password`

**Request Body:**

```json
{
  "email": "testuser@example.com"
}
```

---

### `POST /auth/reset-password`

Reset the user's password using the reset token received via email.
<br>
**Request Body:**

```json
{
  "token": "RESET_TOKEN_FROM_EMAIL",
  "newPassword": "NewPass123"
}
```

---

### `POST /auth/change-password`

**Protected Route:**

```http
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "oldPassword": "OldPass123",
  "newPassword": "NewPass123"
}
```

---

### `POST /auth/current-user`

Retrieve the profile details of the currently authenticated user using the access token.
<br>
**Protected Route:**

```http
Authorization: Bearer <access_token>
```

OR

```http
Cookie: accessToken=<httpOnly-cookie>
```

---

### `POST /healthcheck`

Check whether the server is running and responding correctly.

---

### `POST /auth/refresh-token`

**Request Body:**

```json
{
  "refreshToken": "your_refresh_token"
}
```

OR

```http
Cookie: accessToken=<httpOnly-cookie>
```

---

### `POST /auth/logout`

**Protected Route:**

```http
Authorization: Bearer <access_token>
```

OR

```http
Cookie: accessToken=<httpOnly-cookie>
```
