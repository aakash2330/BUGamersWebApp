import jwt from "jsonwebtoken";
import express from 'express';
import { EVENT } from "../db/entites";

const router = express.Router();

router.get('/', (req,res)=>{
    console.log("event")
    res.send("ADMIN ROUTE")
} )

router.post('/createEvent',async(req,res)=>{
    const {title,description,imageUrl}=req.body;
    const newEvent = new EVENT({title,description,imageUrl})
    await newEvent.save();
    res.send("EVENT CREATED")
})

router.get('/events', async(req,res)=>{
    const eventList = await EVENT.find();
    res.send(eventList);
} )

export default router;