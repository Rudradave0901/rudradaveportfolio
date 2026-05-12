import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: "/var/www/html/fullStack-portfolio/Server/.env" });

mongoose.connect(process.env.MONGO_URI).then(async () => {
    const db = mongoose.connection.db;
    const res = await db.collection("projectsmodels").updateMany(
        { projectName: { $in: ["Testy Foods: Interactive Food Ordering UI", "Restro: SaaS Restaurant Management Platform"] } },
        { $set: { isWorkInProgress: true } }
    );
    console.log("Updated projects:", res.modifiedCount);
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
