import express from "express";
import cors from "cors";
import studentRoute from "./routes/student.route.js";
import sitinRoute from "./routes/sitin.route.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/student", studentRoute);
app.use("/sitin", sitinRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});