import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "/var/www/html/fullStack-portfolio/Server/.env" });

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log(collections.map(c => c.name));
    
    const projects = await db.collection("projects").find({}).toArray();
    console.log("projects count:", projects.length);
    projects.forEach(p => console.log(p.projectName));
    process.exit(0);
});
