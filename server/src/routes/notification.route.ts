import db from "../../db";
import { Router, Request, Response } from "express";

const app = Router();

//get notification by idno

app.get("/:idno", async (req : Request, res : Response) => {
    try {
        const { idno } = req.params;
        const result = await db.query("SELECT * FROM notification WHERE idno = $1 ORDER BY createdAt DESC;", [idno]);
        res.json({success: true, notifications: result.rows});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

//post notification

app.post("/", async (req : Request, res : Response) => {
    try {
        const { idno, title, message, status, type } = req.body;
        const result = await db.query("INSERT INTO notification (idno, title, message, status, type, createdAt) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP) RETURNING *;", [idno, title, message, status, type]);
        res.json({success: true});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})


//update notification by notif_id

app.put("/:notif_id", async (req : Request, res : Response) => {
    try {
        const { notif_id } = req.params;
        const { status } = req.body;
        const result = await db.query("UPDATE notification SET status = $1 WHERE notif_id = $2 RETURNING *;", [status, notif_id]);  
        res.json({success: true, notification: result.rows[0]});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
    })

//delete notification by notif_id

app.delete("/:notif_id", async (req : Request, res : Response) => {
    try {
        const { notif_id } = req.params;
        const result = await db.query("DELETE FROM notification WHERE notif_id = $1 RETURNING *;", [notif_id]);
        res.json({success: true, notification: result.rows[0]});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})
export default app