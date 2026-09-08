# Student Management System

A simple **Student Management System** built using **Node.js, Express.js, JavaScript, HTML, CSS, and Microsoft SQL Server**.

The application allows users to manage student records through a web interface with complete **CRUD (Create, Read, Update, Delete)** functionality.

## Features

* Add new student records
* View all students
* Edit existing student information
* Delete student records
* Search students
* SQL Server database integration
* REST API using Express.js
* Validation for required fields
* Prevents duplicate roll numbers
* Automatically resets student IDs when all records are deleted
* Responsive and simple user interface

## Technologies Used

* **HTML5** – Structure of the application
* **CSS3** – Styling and responsive layout
* **JavaScript** – Frontend functionality and API communication
* **Node.js** – Backend runtime
* **Express.js** – Server and REST API
* **Microsoft SQL Server** – Database
* **MSSQL / msnodesqlv8** – SQL Server connectivity
* **CORS** – Cross-origin request handling

## Project Structure

```text
StudentManagement_SQLServer/
│
└── miniP/
    ├── public/
    │   ├── index.html
    │   ├── script.js
    │   └── style.css
    │
    ├── db.js
    ├── server.js
    ├── package.json
    ├── package-lock.json
    └── .gitignore
```

## Database

The project uses **Microsoft SQL Server**.

### Students Table

The main student table contains:

| Column    | Description         |
| --------- | ------------------- |
| `id`      | Unique student ID   |
| `name`    | Student name        |
| `roll_no` | Student roll number |
| `course`  | Student course      |
| `email`   | Student email       |

The `roll_no` field is treated as unique to prevent duplicate student records.

## API Endpoints

| Method   | Endpoint            | Purpose          |
| -------- | ------------------- | ---------------- |
| `GET`    | `/api/students`     | Get all students |
| `POST`   | `/api/students`     | Add a student    |
| `PUT`    | `/api/students/:id` | Update a student |
| `DELETE` | `/api/students/:id` | Delete a student |

## How It Works

### 1. Add Student

The user enters student details in the form.

```text
Frontend
   ↓
POST /api/students
   ↓
Express Server
   ↓
SQL Server
   ↓
Student inserted into database
```

### 2. Read Students

When the application loads, JavaScript requests the student data from the backend.

```text
Frontend
   ↓
GET /api/students
   ↓
Express Server
   ↓
SQL Server
   ↓
Student data returned
   ↓
Displayed in table
```

### 3. Edit Student

Clicking the **Edit** button loads the selected student's information into the form.

After modifying the details:

```text
Frontend
   ↓
PUT /api/students/:id
   ↓
Express Server
   ↓
SQL Server UPDATE
   ↓
Updated record
```

### 4. Delete Student

Clicking **Delete** sends the student's ID to the backend.

```text
Frontend
   ↓
DELETE /api/students/:id
   ↓
Express Server
   ↓
SQL Server DELETE
   ↓
Student removed
```

## Installation

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Open the Project

```bash
cd StudentManagement_SQLServer/miniP
```

### 3. Install Dependencies

```bash
npm install
```

This installs the required packages from `package.json`.

## SQL Server Setup

Make sure **Microsoft SQL Server** is installed and running on your computer.

Create the required database and `students` table using SQL Server Management Studio.

Update the database connection settings in `db.js` according to your SQL Server configuration.

For example, your SQL Server instance may look like:

```text
YOUR-PC-NAME\SQLEXPRESS
```

## Run the Project

Inside the `miniP` folder, run:

```bash
npm start
```

The server will start on:

```text
http://localhost:3000
```

Open this address in your browser.

## Environment / Security

Do not upload sensitive database credentials or `.env` files to GitHub.

The `.gitignore` file should include:

```gitignore
node_modules/
.env
.env.*
```

## CRUD Operations

The project demonstrates all four basic database operations:

* **Create** → Add student
* **Read** → Display students
* **Update** → Edit student
* **Delete** → Remove student

## Future Improvements

* Student attendance management
* Authentication and login
* Admin dashboard
* Pagination
* Advanced filtering
* Export student records
* Improved UI/UX
* Deployment with a cloud database

## Author

**Your Name**

Built as a learning project to practice **Node.js, Express.js, REST APIs, JavaScript, and SQL Server database integration**.
