# Taskify — Smart To-Do Management App

A clean and modern task management application built to help users organize their daily tasks through a simple and intuitive interface.

## Overview

Taskify is a full-stack web application built with React, Vite, and Express.js. It includes a dedicated frontend and backend, with API routes for authentication and task management.

## Tech Stack

**Frontend**
- React
- Vite
- JavaScript
- CSS
- ESLint

**Backend**
- Node.js
- Express.js
- MongoDB (if configured in the project)
- REST API

## Features

- User authentication with login and signup interfaces
- Task management
- Dashboard and task navigation
- Responsive user interface
- Theme management
- Separate frontend and backend architecture

*Note: Confirm each feature works in the current version before presenting it as production-ready.*

## Project Structure

```text
TO-DO_MY_2/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install Node.js and npm. You will also need MongoDB if the backend uses MongoDB.

### 1. Clone the repository

```bash
git clone https://github.com/divyanshu-dev-07/taskify.git
cd taskify
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment variables

Create a `backend/.env` file using the variable names expected by your backend code.

Example only:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Never commit your actual `.env` file or credentials to GitHub.

### 4. Start the backend

```bash
npm run
```

Use the actual start script defined in `backend/package.json`, for example `npm start` or `npm run dev`.

### 5. Install and start the frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the local URL displayed by Vite in your terminal.

## Development Notes

- Keep frontend and backend dependencies separate.
- Store credentials in environment variables.
- Keep `node_modules` and generated build files out of Git.
- Configure the frontend API URL to match the running backend.

## Future Improvements

- Task due dates and reminders
- Improved filtering and search
- Deployment and automated testing

## Author

**Divyanshu**

GitHub: [@divyanshu-dev-07](https://github.com/divyanshu-dev-07)

---

This project is being developed as a practical full-stack web development project.
