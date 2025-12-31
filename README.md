# Smart Travel Itinerary Planner

![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)

A powerful full-stack web application designed to help users generate, manage, and share travel itineraries effortlessly. The platform supports user authentication, itinerary customization, and an admin dashboard for platform management.

## Project Description

Travel planning can be overwhelming. **Smart Travel Itinerary Planner** simplifies this process by providing a centralized platform where users can create detailed itineraries, view destinations, and manage their trips.

**Key Features:**
*   **User Authentication**: Secure Login and Registration using JWT.
*   **Itinerary Management**: Create, read, update, and delete travel itineraries.
*   **Admin Dashboard**: comprehensive admin portal to monitor user activity and manage itineraries.
*   **Dynamic Covers**: Automatic cover photos for destinations.
*   **Responsive Design**: Built with Angular Material for a seamless experience on all devices.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Credits](#credits)
- [License](#license)

## Prerequisites

Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v14 or higher)
*   [npm](https://www.npmjs.com/) (usually comes with Node.js)
*   [MySQL](https://www.mysql.com/) (for the database)

## Installation

Follow these steps to set up the development environment.

### 1. Clone the Repository

```bash
git clone https://github.com/Kumarbittu12/smart-travel-itinerary.git
cd smart-travel-itinerary
```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install
```

### 3. Database Setup

1.  Make sure your MySQL server is running.
2.  Create a new database (e.g., `travel_db`).
3.  Ensure you have the necessary tables created (Users, Itineraries, etc.).

### 4. Frontend Setup

Navigate to the frontend directory and install dependencies:

```bash
cd ../frontend
npm install
```

## Environment Variables

The backend application requires a `.env` file to function correctly.

1.  Create a file named `.env` in the `backend/` directory.
2.  Add the following variables to it:

```env
# Server Configuration
PORT=5000

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=travel_db

# Security
JWT_SECRET=your_super_secret_jwt_key
```

> **Note:** Replace `your_mysql_password`, `travel_db`, and `your_super_secret_jwt_key` with your actual values.

## Running the Application

### Start the Backend Server

From the `backend` directory:

```bash
# Development mode (with auto-reload)
npm run dev

# Or standard start
npm start
```

The server will start on `http://localhost:5000`.

### Start the Frontend Application

From the `frontend` directory:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload if you change any of the source files.

## Project Structure

```
smart-travel-itinerary-planner/
├── backend/                # Node.js/Express Backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── db/             # Database connection
│   │   ├── middleware/     # Custom middleware (auth, etc.)
│   │   ├── routes/         # API routes
│   │   └── server.ts       # Entry point
│   ├── package.json
│   └── .env                # Environment variables (create this)
│
├── frontend/               # Angular Frontend
│   ├── src/
│   │   ├── app/            # Application source coe
│   │   │   ├── admin/      # Admin module
│   │   │   ├── shared/     # Shared components
│   │   │   └── ...
│   ├── package.json
│   └── angular.json
│
└── README.md
```

## Technologies Used

*   **Frontend**: Angular 16, Angular Material, SCSS, RxJS
*   **Backend**: Node.js, Express.js, TypeScript
*   **Database**: MySQL
*   **Authentication**: JSON Web Token (JWT), bcrypt

## Credits

**Bittu** - *Initial Work & Development*

*   GitHub: [Kumarbittu12](https://github.com/Kumarbittu12)

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
