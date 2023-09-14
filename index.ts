import express from 'express';
import cors from 'cors';;
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes';
import adminRoutes from  './routes/adminRoutes'
import dot from 'dotenv'
dot.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.use("/user",userRoutes);
app.use("/admin",adminRoutes);

const port = 3000;
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})

const dbURL = process.env.DB_URL;
if(dbURL){
    mongoose.connect(dbURL, { dbName: "bugEvents" })
}

export default app;

