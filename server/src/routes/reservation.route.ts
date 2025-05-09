import db from "../../db";
import { Router, Request, Response } from "express";

const app = Router();

//add reservations
//idno, labno, pcno, purpose, timein, status
app.post("/", async (req : Request, res : Response) => {
    try {
        const {idno, laboratory, pcno, stringDate, purpose, time, status} = req.body;
        const labno = laboratory
        const timein = `${stringDate} ${time}`
        const result = await db.query("INSERT INTO reservation(idno, labno, pcno, purpose, timein, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",[idno, labno, pcno, purpose, timein, status]);
        res.json({ success: result.rowCount === 1 });
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

//get reservation by idno
app.get("/student/:idno", async (req : Request, res : Response) => {
    try {
        const { idno } = req.params;
        const result = await db.query("SELECT * FROM reservation WHERE idno = $1;", [idno]);
        res.json({success: true, reservation: result.rows});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

//get all reservation with student details
app.get("/", async (req : Request, res : Response) => {
    try {
        const result = await db.query("SELECT r.*, s.* FROM reservation r JOIN students s ON r.idno = s.idno;");
        res.json({success: true, reservation: result.rows});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

//update reservation status by id
app.put("/update", async (req : Request, res : Response) => {
    const {id, status} = req.body;
    try {
        const result = await db.query("UPDATE reservation SET status = $1 WHERE id = $2 RETURNING *;",[status, id]);
        res.json({success: result.rowCount===1});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

export default app