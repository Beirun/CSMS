import db from "../../db";
import { Router, Request, Response } from "express";

const app = Router();


//get all pc
app.get("/", async (req : Request, res : Response) => {
    try {
        const result = await db.query("SELECT * FROM availablepc;");
        res.json({success: true, pcs: result.rows});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

//update pc status by pcno and labno
app.put("/update", async (req : Request, res : Response) => {
    const {pcno, labno, status} = req.body;
    try {
        const result = await db.query("UPDATE availablepc SET status = $1 WHERE pcno = $2 AND labno = $3 RETURNING *;",[status, pcno, labno]);
        res.json({success: result.rowCount===1});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

//get available pc
app.get("/available", async (req : Request, res : Response) => {
    try {
        const result = await db.query("SELECT * FROM availablepc WHERE status = 'Available';");
        res.json({success: true, pcs: result.rows});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

export default app