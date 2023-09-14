import jwt from "jsonwebtoken";
import express from 'express';
import { USER } from "../db/entites";
import { signupInput, signupParams } from "../types/signupInput";
import dot from 'dotenv'
import { authenticateJwt } from "../middleware/authenticate";
dot.config();

const router = express.Router();

router.get('/', async(req,res)=>{
   return res.send(await USER.find({}))
} )


router.post('/signup', async(req,res)=>{
    let parsedInput=signupInput.safeParse(req.body);
    console.log(parsedInput)

    if(!parsedInput.success){
      return res.status(403).json({error:parsedInput.error})
    }
    if(parsedInput.success){
        const {username,password}=parsedInput.data;
        const admin_username=process.env.USERNAME_ADMIN ; const admin_password=process.env.PASSWORD_ADMIN;
        if(admin_username && admin_password){
            if(admin_username===username && admin_password===password){
                const user = new USER({username,password,role:"ADMIN"});
                 await user.save();
                 return res.send("USER CREATED")
            }
        }
        const newUser = await USER.findOne({username,password});
        if(newUser){
           return res.status(403).json({error:"USER ALREADY EXISTS"})
        }
        const user = new USER({username,password,role:"USER"});
        await user.save();
       return res.send("USER CREATED")
    }
   
} )

router.post('/login' , async(req,res)=>{
    let parsedInput=signupInput.safeParse(req.body);
    console.log(parsedInput);
    if(!parsedInput.success){
      return res.status(403).json({message:"INVALID CREDENTIALS"})
    }
    if(parsedInput.success){
        const {username,password}=parsedInput.data;
        const user = await USER.findOne({username,password});
        if(user){
            const secret = process.env.SECRET;
            if(secret){
                const token = jwt.sign({ id: user._id },secret,{ expiresIn: '1h' });
                return res.status(200).json({message:"LOGIN SUCCESSFUL",token,role:user.role,username:user.username})
            }
            else return res.status(500).json({message:"SERVER ERROR"})
             
        }
        else return res.status(403).json({message:"USER DOESNT EXIST"})
    }
})


router.post("/verifyJWT",authenticateJwt,async(req,res)=>{
        const userId = req.headers["userId"];
        const user = await USER.findOne({_id:userId});
        if(user){
            return res.status(200).json({role:user.role,username:user.username})
        }
        else return res.status(403).json({message:"COULDNT FIND USER"})
})




export default router;