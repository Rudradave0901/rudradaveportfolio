import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "/var/www/html/fullStack-portfolio/Server/.env" });

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const projects = await db.collection("projects").find({}).toArray();
    projects.forEach(p => console.log(p.projectName));
    process.exit(0);
});
