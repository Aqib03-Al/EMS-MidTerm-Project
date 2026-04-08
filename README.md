# Employee Management System (EMS Pro)
video link:
https://youtu.be/ShyVMwqblWk

## Project Overview

EMS Pro provides:

- Public landing page (`/`)
- Admin login system (session-based authentication)
- Professional admin dashboard with analytics cards
- Employee CRUD (web + REST API)
- Department management module
- Search and department filters
- Structured error handling and request logging

## Core Features

- **Admin-only authentication**
  - Public registration removed
  - Only authorized admin can access and manage system
- **Employee Management**
  - Create, read, update, delete employees
  - Validation (required name, valid unique email, positive salary)
- **Department Management**
  - Add, update, delete departments
  - Department-linked employee consistency handling
- **RESTful API**
  - JSON responses with proper HTTP status codes
- **UI/UX**
  - Responsive Bootstrap 5 design
  - Modern landing, dashboard, about, services, policy pages
  - Alerts and clean forms/tables

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS (templating)
- Bootstrap 5 (CDN)

## Project Structure

```text
.
├── app.js
├── bin/
│   └── www
├── middleware/
│   ├── auth.js
│   └── requestLogger.js
├── models/
│   ├── Department.js
│   ├── Employee.js
│   └── User.js
├── public/
│   └── stylesheets/
│       └── style.css
├── routes/
│   ├── auth.js
│   └── index.js
└── views/
    ├── about.ejs
    ├── departments.ejs
    ├── employee-form.ejs
    ├── error.ejs
    ├── index.ejs
    ├── landing.ejs
    ├── login.ejs
    ├── policy.ejs
    ├── services.ejs
    └── partials/
        ├── footer.ejs
        └── header.ejs
```

## Installation and Configuration

### 1) Clone or open project

```bash
cd "C:\Users\NaWaB\Desktop\Mid-Term node Lab"
```

### 2) Install dependencies

```bash
npm install
```

### 3) Configure environment (recommended)

You can run with defaults, or set custom environment variables.

#### Default values used by app

- `PORT=3000`
- `MONGODB_URI=mongodb://127.0.0.1:27017/ems_db`
- `SESSION_SECRET=ems_super_secret_key`
- `ADMIN_EMAIL=admin@ems.com`
- `ADMIN_PASSWORD=admin123`
- `ADMIN_NAME=Aqib Ali`

#### PowerShell example

```powershell
$env:PORT="3000"
$env:MONGODB_URI="mongodb://127.0.0.1:27017/ems_db"
$env:SESSION_SECRET="change_this_secret"
$env:ADMIN_EMAIL="admin@ems.com"
$env:ADMIN_PASSWORD="admin123"
$env:ADMIN_NAME="Aqib Ali"
```

### 4) Start MongoDB

Make sure MongoDB server/service is running locally, or provide a cloud URI in `MONGODB_URI`.

### 5) Run application

```bash
npm start
```

When server starts, terminal prints a clickable URL like:

`Server running at: http://localhost:3000`

## Default Admin Login

- **Email:** `admin@ems.com`
- **Password:** `admin123`
- **Role:** `admin`

On first run, default admin is auto-created (if not found).

## Web Routes

### Public routes

- `GET /` - Landing page (if not logged in)
- `GET /about` - About page
- `GET /services` - Services page
- `GET /policy` - Policy page
- `GET /auth/login` - Login page
- `POST /auth/login` - Login submit

### Protected routes (admin session required)

- `POST /auth/logout` - Logout
- `GET /` - Dashboard (when logged in)
- `GET /employees/new` - New employee form
- `POST /employees` - Create employee
- `GET /employees/:id/edit` - Edit form
- `PUT /employees/:id` - Update employee
- `DELETE /employees/:id` - Delete employee
- `GET /departments` - Departments management
- `POST /departments` - Create department
- `PUT /departments/:id` - Update department
- `DELETE /departments/:id` - Delete department

## REST API Endpoints (JSON)

- `GET /api/employees` - Fetch all employees
- `GET /api/employees/:id` - Fetch single employee
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Replace employee
- `PATCH /api/employees/:id` - Partially update employee
- `DELETE /api/employees/:id` - Delete employee

### Sample JSON Body (POST/PUT/PATCH)

```json
{
  "name": "Ali Raza",
  "email": "ali@example.com",
  "designation": "Software Engineer",
  "department": "IT",
  "salary": 120000,
  "joiningDate": "2024-01-10"
}
```

## Validation and Error Handling

- `Employee` schema validations:
  - `name` required
  - `email` required + regex format + unique
  - `salary` must be positive
- Duplicate email handling for MongoDB unique errors
- 404 and 500 middleware
- API errors return structured JSON

## Screenshots

Add your project screenshots in a folder like `docs/screenshots/` and keep the file names below.

```md
![Landing Page](docs/screenshots/landing.png)
![Admin Login](docs/screenshots/login.png)
![Admin Dashboard](docs/screenshots/dashboard.png)
![Employee Form](docs/screenshots/employee-form.png)
![Departments Module](docs/screenshots/departments.png)
![About Page](docs/screenshots/about.png)
![Services Page](docs/screenshots/services.png)
![Policy Page](docs/screenshots/policy.png)
```

Recommended screenshots to include:

1. Landing page
2. Login page
3. Dashboard with stats cards
4. Employee listing + search/filter
5. Add/Edit employee form
6. Department management page
7. About/Services/Policy pages

## Quick Troubleshooting

- **Port already in use**
  - Run on different port:
    - PowerShell: `$env:PORT="3001"; npm start`
- **MongoDB connection failed**
  - Ensure MongoDB service is running
  - Verify `MONGODB_URI`
- **Changes not visible**
  - Hard refresh browser (`Ctrl + F5`)
  - Make sure no old server process is running

## Author

- **Aqib Ali**
- Mid-Term Project - Advanced Web Technologies
