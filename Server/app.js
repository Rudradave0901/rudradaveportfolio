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
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import { trackVisitor } from "./middlewares/visitor.middleware.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(o => o.trim().replace(/\/$/, "")) : [];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

// Security HTTP headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// NoSQL injection prevention is handled natively by Mongoose schemas and strict Express Validator rules.
// express-mongo-sanitize removed due to incompatibility with Express 5 res/req getters.

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

app.use(express.json({ limit: '10kb' })); // Body limit
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

// Error Handling Middleware
app.use(errorMiddleware);

export { app };