import express from "express";
import cors from "cors";
import studentRoute from "./routes/student.route";
import sitinRoute from "./routes/sitin.route";
import announcementRoute from "./routes/announcement.route";
import resourcesRoute from "./routes/resource.route";
import schedulesRoute from "./routes/schedules.route";
import pcRoute from "./routes/pc.route";
import reservationRoute from "./routes/reservation.route";
import fileUpload from "express-fileupload";
const app = express();

app.use(fileUpload())
app.use(cors());
app.use(express.json());

app.use("/student", studentRoute);
app.use("/sitin", sitinRoute);
app.use("/announcement", announcementRoute);
app.use("/resource", resourcesRoute);
app.use("/schedules", schedulesRoute);
app.use("/pc", pcRoute);
app.use("/reservation",reservationRoute)


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});