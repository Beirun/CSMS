import db from "../../db";
import { Router, Request, Response } from "express";

const app = Router();


app.post("/", async (req : Request, res : Response) => {
    try {
        const {idno, sitin_purpose, sitin_laboratory} = req.body;
        const check = await db.query("SELECT * FROM current_sitins where idno = $1",[idno]);

        if (check.rowCount===1){
            res.json({success: check.rowCount!==1});
            return
        }
        const result = await db.query("INSERT INTO sitin_history(idno, sitin_purpose, sitin_laboratory, sitin_timein) VALUES ($1, $2, $3, NOW()) RETURNING *;",[idno, sitin_purpose, sitin_laboratory]);
        res.json({ success: result.rowCount === 1 });
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

app.get("/current", async (req: Request, res : Response) => {
    try {
        const result = await db.query("SELECT * from current_sitins;");
        res.json({success: true, sitins: result.rows});
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
})

app.post("/logout/:id", async(req : Request, res : Response)=>{
    const {id} = req.params;
    try {
        const result = await db.query("UPDATE sitin_history SET sitin_timeout = NOW() WHERE sitin_id = $1 RETURNING *;",[id])
        res.json({success: result.rowCount===1})
    } catch (err: any) {
        res.status(500).json({error: err.message})
    }
})

app.get("/", async (req : Request, res : Response) => {
    try {
        const result = await db.query("SELECT * from sitins;");
        res.json({success: true, sitins: result.rows});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

export default app