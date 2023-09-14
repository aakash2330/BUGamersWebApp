import { NextFunction , Request , Response } from "express";
import  jwt  from "jsonwebtoken";
import dot from 'dotenv'
dot.config();

export function authenticateJwt(req:Request,res:Response,next:NextFunction){
    const authHeader = req.headers.authorization;
    if(authHeader){
        const token = authHeader.split(" ")[1]
        const secret = process.env.SECRET;
        console.log({secret,token})
        if(secret){
            jwt.verify(token,secret,(err,payload)=>{
                if(err){
                    return res.status(403).json({message:err})
                }
                if(!payload){
                    return res.status(403).json({message:"COULDNT VERIFY PAYLOAD"})
                }
                if (typeof payload === "string") {
                    return res.sendStatus(403);
                  }
                  
                  req.headers["userId"] = payload.id;
                  next();
            })
        }
        else return res.status(500).json({message:"SERVER ERROR"})
       
    }

   else  return res.status(403).json("AUTHORIZATION FAILED")
}