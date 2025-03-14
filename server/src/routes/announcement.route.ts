import db from "../../db";
import { Router, Request, Response } from "express";

const app = Router();

app.get("/", async (req : Request, res: Response) => {
    try {
        const result = await db.query("SELECT * FROM announcement ORDER BY announcement_date DESC;");
        res.json({success: true, announcements: result.rows});
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
})

app.post("/", async (req: Request, res : Response) => {
    try {
        const { announcement_message, announcement_date} = req.body;
        const result = await db.query("INSERT INTO announcement(announcement_message, announcement_date) VALUES ($1, NOW()) RETURNING *;",[announcement_message]);
        res.json({ success: result.rowCount === 1 });
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
})


export default app