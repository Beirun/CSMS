import db from "../db.js";
import { Router } from "express";

const app = Router();

app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM announcement ORDER BY announcement_date DESC;");
        res.json({success: true, announcements: result.rows});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

app.post("/", async (req, res) => {
    try {
        const { announcement_message, announcement_date} = req.body;
        const result = await db.query("INSERT INTO announcement(announcement_message, announcement_date) VALUES ($1, $2) RETURNING *;",[announcement_message, announcement_date]);
        res.json({ success: result.rowCount === 1 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

export default app