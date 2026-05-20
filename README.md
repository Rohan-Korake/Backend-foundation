# Backend Foundation

Backend Foundation is my personal backend learning repository where I document and practice core backend development concepts by building real-world projects using Node.js, Express.js, and MongoDB. This repository tracks my journey of learning server-side development, authentication, APIs, database integration, and scalable backend architecture.

## Terminal-Based Project Setup

Follow these terminal commands to set up the initial backend project structure from scratch.

`Step 1:` Use the following command to create the project root folder:

```bash
mkdir backend-foundation
```

`Step 2:` Move into the newly created project folder:

```bash
cd backend-foundation
```

`Step 3:` Initialize a new Node.js project interactively. This command will prompt you to enter project details such as name, version, and description to generate the package.json file.

```bash
npm init
```

`Step 4:` Create the main project directories:

```bash
mkdir public src
```

`Step 5:` Move to the `src` folder and create subdirectories.

```bash
cd src
```

`Step 6:` Create subdirectories inside src to organize the backend structure.

```bash
mkdir controllers models routes middlewares utils db validators
```

`Step 7:` Create the main application files inside `src`:

```bash
touch app.js index.js
```

`Step 8:` Create `.gitkeep` files to ensure empty folders are tracked by

```bash
touch controllers/.gitkeep models/.gitkeep routes/.gitkeep middlewares/.gitkeep utils/.gitkeep db/.gitkeep validators/.gitkeep
```

`Step 9:` Move back to the root directory:

```bash
cd ..
```

`Step 10:`Navigate to the public folder:

```bash
cd public
```

`Step 11:`Create an `images` directory:

```bash
mkdir images
```

`Step 12:`Return back to the root directory:

```bash
cd ..
cd ..
```

`Step 13:` Create environment and Git configuration files:

```bash
touch .env .gitignore
```

`Step 14:` Configure .gitignore

```bash
node_modules/
.env
.vscode/
.DS_Store
dist/
```

`Step 15:` Install Prettier as a development dependency:

```bash
npm install --save-dev --save-exact prettier
```

`Step 16:`Create Prettier configuration files

```bash
touch .prettierrc .prettierignore
```

`Step 17:` Configure .prettierrc

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

`Step 18:` Configure .prettierignore

```bash
node_modules
dist
.env
package-lock.json
```

## Project Structure

![Backend Structure](./public/images/backend-structure.png)

## Installing Required Dependencies

Install dotenv to manage environment variables from a `.env` file.

```bash
npm i dotenv
```

Install nodemon to automatically restart the server when file changes are detected.

```bash
npm i nodemon
```

Installs Express framework for building backend APIs and handling routes.

```bash
npm i express
```

Enables CORS for handling cross-origin requests.

```bash
npm i cors
```
