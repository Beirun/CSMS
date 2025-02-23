import db from "../db.js";
import { Router } from "express";

const app = Router();

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM student");
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.get("/idno/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query("SELECT * FROM student WHERE idno = $1;", [id]);
        res.json({ success: result.rowCount === 0 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.post("/", async (req, res) => {
    try {
        const {idno, firstname, middlename, lastname, course, yearlevel, email, username, password} = req.body;
        const result = await db.query("INSERT INTO student VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *;",[idno, firstname, middlename, lastname, course, yearlevel, email, username, password]);
        res.json({ success: result.rowCount === 1 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.post("/login", async (req, res) => {
    try {
        const {username, password} = req.body;
        const result = await db.query("SELECT * FROM student WHERE LOWER(username) = LOWER($1) AND password = $2;",[username, password]);
        res.json({ success: result.rowCount === 1, studentInfo: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})


app.put("/", async (req, res) => {
    try {
        const {idno, firstname, middlename, lastname, course, yearlevel, email, username, password} = req.body;
        const result = await db.query("UPDATE student SET firstname = $1, lastname = $2, middlename = $3, course = $4, yearlevel = $5, email = $6, username = $7, password = $8 WHERE idno = $9 RETURNING *;",[firstname, lastname, middlename, course, yearlevel, email, username, password, idno]);
        res.json({ success: result.rowCount === 1 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }

})

export default app