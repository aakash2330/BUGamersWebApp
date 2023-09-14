import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:String,
    password:String,
    role:String,
})

const eventSchema = new mongoose.Schema({
    title:String,
    description:String,
    imageUrl:String
})

export const USER = mongoose.model('user',userSchema);
export const EVENT = mongoose.model('event',eventSchema);