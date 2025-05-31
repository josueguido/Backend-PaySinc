# Backend PaySinc

![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-green)
![PostgreSQL](https://img.shields.io/badge/postgresql-%3E%3D12-blue)
![License](https://img.shields.io/badge/license-MIT-brightgreen)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)
![Jest](https://img.shields.io/badge/tested%20with-jest-99424f?logo=jest)
![Made with Express](https://img.shields.io/badge/express.js-%3E%3D4.0.0-black?logo=express)

Backend PaySinc is a RESTful API designed to manage shared expenses among friends and groups. This project uses Node.js, Express, and PostgreSQL to provide a robust and scalable solution. It is ideal for showcasing your backend development skills in your portfolio.

## 📌 Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup](#1-clone-the-repository)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)


## Features

- **Authentication and Authorization**: JWT implementation to secure routes and manage user sessions.
- **User Management**: Registration, login, and handling of access and refresh tokens.
- **Group and Friend Management**: Full CRUD for groups and friends.
- **Expense Management**: Full CRUD for expenses, including soft delete functionality.
- **Data Validation**: Request validation using Zod.
- **Error Handling**: Centralized error handling system with custom classes.
- **Security**: Use of Helmet and rate limiting to protect the API.
- **Logging**: Error and event logging with Winston.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express**: Framework for building web applications and APIs.
- **PostgreSQL**: Relational database.
- **JWT**: For authentication and authorization.
- **Zod**: Schema validation.
- **Winston**: Logging library.
- **Jest**: For unit and integration testing.

## Project Structure

```text
.
├── src/
│   ├── config/         # Project configuration
│   ├── controllers/    # Route controllers
│   ├── db/             # Database connection
│   ├── errors/         # Custom error handling classes
│   ├── middleware/     # Custom middlewares
│   ├── routes/         # Route definitions
│   ├── schemas/        # Data validation with Zod
│   ├── test/           # Automated tests
│   ├── utils/          # General utilities
│   ├── logs/           # Log files
├── .env                # Environment variables
├── package.json
├── README.md
```

---

### 1. Clone the Repository

```bash
git clone https://github.com/tu-usuario/backend-paysinc.git
cd backend-paysinc
```

### 2. Install Dependencies

```bash
npm install
```

## Environment Variables


Make sure to configure your PostgreSQL database credentials.  
Run the database migrations (if applicable).

Create a `.env` file in the root of your project with the following variables:

| Variable             | Description                                  | Example Value             |
| -------------------- | -------------------------------------------- | ------------------------- |
| `DB_USER`            | PostgreSQL database user                     | `postgres`                |
| `DB_HOST`            | Database host address                        | `localhost`               |
| `DB_NAME`            | Name of the PostgreSQL database              | `PaySinc`                 |
| `DB_PASSWORD`        | Database user password                       | `your_db_password`        |
| `DB_PORT`            | Database port (default for PostgreSQL: 5432) | `5432`                    |
| `JWT_SECRET`         | Secret key for JWT authentication            | `your_jwt_secret`         |
| `JWT_REFRESH_SECRET` | Secret key for JWT refresh tokens            | `your_refresh_jwt_secret` |
| `PORT`               | Port where the server will run               | `3000`                    |

**Note:** Never commit your real `.env` file to version control. Use a `.env.example` file to share required variables without sensitive data.

### 3. Start the Development Server

Start the development server with:

```bash
npm run dev
```

## Scripts

Here are the available npm scripts:

- **`npm run dev`**: Starts the development server.
- **`npm run build`**: Builds the application for production.
- **`npm run preview`**: Previews the production build.
- **`npm run lint`**: Runs ESLint to check for code quality issues.

---

## Usage

Base URL: http://localhost:3000

## 📚 API Endpoints

| Method | Endpoint           | Description          |
| ------ | ------------------ | -------------------- |
| POST   | /api/auth/login    | User login           |
| POST   | /api/auth/register | User registration    |
| POST   | /api/auth/logout   | Revoke refresh token |
| POST   | /api/auth/refresh  | Get new access token |
| GET    | /api/friends       | Get all friends      |
| GET    | /api/friends/:id   | Get one friend       |
| POST   | /api/friends       | Create friend        |
| PUT    | /api/friends/:id   | Update friend        |
| DELETE | /api/friends/:id   | Delete friend        |
| ...    | ...                | ...                  |

## 📚 API Documentation

Accede a la documentación interactiva en tu entorno local:  
👉 [Swagger UI local](http://localhost:3000/api/docs)

Interact with the live Swagger docs here:  
👉 [PaySinc Swagger UI](https://josueguido/backend-paysinc/swagger.html)

## Testing

This project uses **Jest** and **Supertest** for automated unit and integration testing.
Run automated tests with:

```bash
npm test
```

## Contributing

Contributions are welcome! Please follow these steps to contribute:

### Commit Message Guidelines

This project uses [Semantic Release](https://github.com/semantic-release/semantic-release) to automate versioning and changelog generation. Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for your commit messages. Here are some examples:

- **feat**: Introduce a new feature (e.g., `feat: add user authentication`).
- **fix**: Fix a bug (e.g., `fix: resolve login issue`).
- **docs**: Update documentation (e.g., `docs: update README`).
- **style**: Code style changes (e.g., `style: format code`).
- **refactor**: Code refactoring without changing functionality (e.g., `refactor: optimize API calls`).
- **test**: Add or update tests (e.g., `test: add unit tests for login`).
- **chore**: Maintenance tasks (e.g., `chore: update dependencies`).

### Steps to Contribute

1. Fork the repository.
2. Create a new branch for your feature or fix:
   ```bash
   git checkout -b feat/your-feature-name
   ```
3. Make your changes and commit them using the guidelines above.
4. Push your branch to your forked repository:
   ```bash
   git push origin feat/your-feature-name
   ```
5. Submit a pull request to the `development` branch of this repository.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or support, feel free to contact:

- **Author**: Josue Guido
- **Email**: josuguido@example.com
- **GitHub**: [Josue Guido](https://github.com/josueguido)

```

```
