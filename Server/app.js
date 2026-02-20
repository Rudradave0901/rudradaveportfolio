import express from "express";
import bannerRouter from "./routes/Banner.route.js";
import aboutRouter from "./routes/About.route.js";
import skillRoute from "./routes/Skills.route.js"
import ProjectsRoute from "./routes/Projects.route.js";
import EduExpRoute from "./routes/EduExp.route.js";
import ResumeRoute from "./routes/Resume.route.js";
import authRoute from "./routes/auth.route.js";
import messageRouter from "./routes/Message.route.js";
import visitorRouter from "./routes/Visitor.route.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { trackVisitor } from "./middleweres/visitor.middleware.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// ON NORMAL PATH SAY HELLO AND TRACK VISITOR
app.get("/", trackVisitor, (req, res) => {
    res.send("Hello World");
});

app.use("/api/banners", bannerRouter);
app.use("/api/about", aboutRouter);
app.use("/api/skills", skillRoute);
app.use("/api/projects", ProjectsRoute);
app.use("/api/eduExp", EduExpRoute);
app.use("/api/resume", ResumeRoute);
app.use("/api/auth", authRoute);
app.use("/api/messages", messageRouter);
app.use("/api/visitors", visitorRouter);

export { app };