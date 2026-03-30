# Employee Management System (EMS)

A professional RESTful web application for managing employee records using Node.js, Express.js, MongoDB (Mongoose), EJS, and Bootstrap 5.

## Features

- Full Employee CRUD with REST API and web interface.
- MongoDB integration with schema validation and duplicate email protection.
- Session-based authentication (Admin Login/Logout) with role-based access control.
- Bootstrap-powered responsive UI with navbar, forms, and employee data table.
- Search by employee name and department filter on dashboard.
- Dedicated landing page and professional admin dashboard with analytics cards.
- Department management module (create, update, delete).
- Admin-only access (public registration removed).
- Request logger middleware with centralized 404/500 error handling.
- Success/error alerts for CRUD operations.

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS
- Bootstrap 5

## Setup and Run

1. Install dependencies:

   ```bash
   npm install
   ```

2. Configure MongoDB (optional if using local default):

   - Default: `mongodb://127.0.0.1:27017/ems_db`
   - Or set an environment variable:

   ```bash
   set MONGODB_URI=mongodb://127.0.0.1:27017/ems_db
   ```

3. Start the app:

   ```bash
   npm start
   ```

4. Open in browser:

   - `http://localhost:3000`

## Authentication

- Login route: `GET /auth/login`
- Logout route: `POST /auth/logout`
- Default admin is auto-created on first run:
  - Email: `admin@ems.com`
  - Password: `admin123`
- Admin can perform all operations (employees and departments).
- Public visitors first see a landing page, then admin login to continue.

## API Endpoints

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
