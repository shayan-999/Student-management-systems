const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/api/students", async (req, res) => {
    try {
        const pool = await db.poolPromise;
        const result = await pool.request().query(`
            SELECT id, name, roll_no, course, email
            FROM students
            ORDER BY id ASC
        `);
        res.json(result.recordset);
    } catch (err) {
        console.error("GET STUDENTS ERROR:", err);
        res.status(500).json({ message: "Database error", error: err.message });
    }
});

app.post("/api/students", async (req, res) => {
    const { name, roll_no, course, email } = req.body;

    if (!name || !roll_no || !course) {
        return res.status(400).json({
            message: "Name, roll number and course are required"
        });
    }

    try {
        const pool = await db.poolPromise;
        const result = await pool.request()
            .input("name", db.sql.VarChar(100), name.trim())
            .input("roll_no", db.sql.VarChar(50), roll_no.trim())
            .input("course", db.sql.VarChar(100), course.trim())
            .input("email", db.sql.VarChar(100), email ? email.trim() : null)
            .query(`
                INSERT INTO students (name, roll_no, course, email)
                OUTPUT INSERTED.id
                VALUES (@name, @roll_no, @course, @email)
            `);

        const id = result.recordset[0].id;
        console.log("Student added with ID:", id);
        res.status(201).json({ message: "Student added successfully", id });
    } catch (err) {
        console.error("INSERT ERROR:", err);
        if (err.number === 2627 || err.number === 2601) {
            return res.status(400).json({ message: "Roll number already exists" });
        }
        res.status(500).json({ message: "Failed to add student", error: err.message });
    }
});

app.put("/api/students/:id", async (req, res) => {
    const id = Number(req.params.id);
    const { name, roll_no, course, email } = req.body;

    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
    }

    if (!name || !roll_no || !course) {
        return res.status(400).json({
            message: "Name, roll number and course are required"
        });
    }

    try {
        const pool = await db.poolPromise;
        const result = await pool.request()
            .input("id", db.sql.Int, id)
            .input("name", db.sql.VarChar(100), name.trim())
            .input("roll_no", db.sql.VarChar(50), roll_no.trim())
            .input("course", db.sql.VarChar(100), course.trim())
            .input("email", db.sql.VarChar(100), email ? email.trim() : null)
            .query(`
                UPDATE students
                SET name = @name,
                    roll_no = @roll_no,
                    course = @course,
                    email = @email
                WHERE id = @id
            `);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.json({ message: "Student updated successfully" });
    } catch (err) {
        console.error("UPDATE ERROR:", err);
        if (err.number === 2627 || err.number === 2601) {
            return res.status(400).json({ message: "Roll number already exists" });
        }
        res.status(500).json({ message: "Failed to update student", error: err.message });
    }
});

app.delete("/api/students/:id", async (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
        return res.status(400).json({ message: "Invalid student ID" });
    }

    try {
        const pool = await db.poolPromise;
        const result = await pool.request()
            .input("id", db.sql.Int, id)
            .query("DELETE FROM students WHERE id = @id");

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Student not found" });
        }

        const countResult = await pool.request().query(
            "SELECT COUNT(*) AS total FROM students"
        );

        if (countResult.recordset[0].total === 0) {
            await pool.request().query("DBCC CHECKIDENT ('students', RESEED, 0)");
            console.log("All students deleted. ID reset to 1.");
        }

        res.json({ message: "Student deleted successfully" });
    } catch (err) {
        console.error("DELETE ERROR:", err);
        res.status(500).json({ message: "Failed to delete student", error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
