import express from "express";
import cors from "cors";
import studentRoute from "./routes/student.route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/student", studentRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});