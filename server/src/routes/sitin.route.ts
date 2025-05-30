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

app.post("/point/:id", async(req : Request, res : Response)=>{
    const {id} = req.params;
    try {
        const result = await db.query("UPDATE sitin_history SET point = 1 WHERE sitin_id = $1 RETURNING *;",[id])
        res.json({success: result.rowCount===1})
    } catch (err: any) {
        res.status(500).json({error: err.message})
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

app.get("/student/:idno", async (req : Request, res : Response) => {
    const {idno} = req.params;
    try {
        const result = await db.query(`SELECT s.sitin_id, s.idno, s.sitin_purpose, s.sitin_laboratory, s.sitin_timein, s.sitin_timeout, f.sitin_feedback
                                        FROM sitins s
                                        LEFT JOIN feedback f ON s.sitin_id = f.sitin_id
                                        WHERE s.idno = $1;`,[idno]);
        res.json({success: true, sitins: result.rows});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

app.get("/feedback", async (req : Request, res : Response) => {
    try {
        const result = await db.query("SELECT s.*, f.sitin_feedback FROM sitins s JOIN feedback f ON s.sitin_id = f.sitin_id ORDER BY s.sitin_id DESC;");
        res.json({success: true, sitins: result.rows});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

app.post("/feedback", async (req : Request, res : Response) => {
    const {sitin_id, sitin_feedback} = req.body;
    try {
        const result = await db.query("INSERT INTO feedback(sitin_id, sitin_feedback) VALUES ($1, $2);",[sitin_id, sitin_feedback]);
        res.json({success: result.rowCount===1});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

app.post("/reset", async (req : Request, res : Response) => {
    try {
        const result = await db.query("UPDATE session SET sessions = 30;");
        console.log(result)
        res.json({success: true});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

app.post("/reset/:idno", async (req : Request, res : Response) => {
    const {idno} = req.params;
    try {
        const result = await db.query("UPDATE session SET sessions = 30 WHERE idno = $1;",[idno]);
        res.json({success: result.rowCount===1});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

app.get("/leaderboard", async (req : Request, res : Response) => {
    try {
        const result = await db.query("SELECT * FROM leaderboard;");
        res.json({success: true, leaderboard: result.rows});
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})

app.post("/point/idno/:idno", async (req : Request, res : Response) => {
    const {idno} = req.params;
    try {
        // console.log('idno', idno)
        const points = await db.query("SELECT points FROM leaderboard WHERE idno = $1;",[idno]);
        // console.log(points)
        // console.log(points.rows[0].points)
        if(points.rows[0].points % 3 === 0){
            await db.query("UPDATE session SET sessions = sessions + 1 WHERE idno = $1 RETURNING *;",[idno]);
            res.json({success: true});
        }else{
            res.json({success: false});
        }
    } catch (err : any) {
        res.status(500).json({ error: err.message });
    }
})  

export default app