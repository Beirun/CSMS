import express from "express";
import cors from "cors";
import studentRoute from "./routes/student.route";
import sitinRoute from "./routes/sitin.route";
import announcementRoute from "./routes/announcement.route";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/student", studentRoute);
app.use("/sitin", sitinRoute);
app.use("/announcement", announcementRoute);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});