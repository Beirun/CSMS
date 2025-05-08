import db from "../../db";
import { Router, Request, Response } from "express";

const app = Router();

app.get("/:lab", async (req : Request, res: Response) => {
    const {lab} = req.params
    try {
        const result = await db.query("SELECT * FROM lab_sched WHERE lab_number = $1 ORDER BY id;", [lab]);
        res.json({success: true, lab_sched: result.rows});
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
})

app.put("/update", async (req : Request, res : Response) => {
    const {lab, time, day, status} = req.body;
    console.log("lab", lab);
    console.log("time", time);
    console.log("day", day);
    console.log("status", status);
    const result = await db.query("SELECT * FROM lab_sched WHERE lab_number = $1 AND days = $2 AND time = $3;",[ lab, day, time]);
    console.log(result)
    try {
        const result = await db.query("UPDATE lab_sched SET status = $1 WHERE lab_number = $2 AND days = $3 AND time = $4 RETURNING *;",[status, lab, day, time]);
        res.json({success: result.rowCount===1});
    } catch (err: any) {
        res.status(500).json({ error: err.message });   
    }
})



export default app