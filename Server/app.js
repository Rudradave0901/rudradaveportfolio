import express from "express";
import bannerRouter from "./routes/Banner.route.js";
import aboutRouter from "./routes/About.route.js";
import skillRoute from "./routes/Skills.route.js"
import ProjectsRoute from "./routes/Projects.route.js";
import EduExpRoute from "./routes/EduExp.route.js";
import ResumeRoute from "./routes/Resume.route.js";
import authRoute from "./routes/auth.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// ON NORMAL PATH SAY HELLO
app.get("/", (req, res) => {
    res.send("Hello World");
});

app.use("/api/banners", bannerRouter);
app.use("/api/about", aboutRouter);
app.use("/api/skills", skillRoute);
app.use("/api/projects", ProjectsRoute);
app.use("/api/eduExp", EduExpRoute);
app.use("/api/resume", ResumeRoute);
app.use("/api/auth", authRoute);

export { app };