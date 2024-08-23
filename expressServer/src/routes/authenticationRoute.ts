import express from 'express';
import {Request, Response} from "express";
import session from 'express-session';
const router = express.Router();

import bcrypt from "bcrypt"; 
import UserManager from '../user';

router.get("/login", (req:Request, res:Response )=>
    {
        res.status(400).send("Invalid request method: GET");
    });

router.post("/login", async (req:Request, res:Response) => 
{
   
   const userManager:UserManager = UserManager.getInstance;


   const foundUser = userManager.getUser(req.body.userName);

   if (foundUser.getUserName != "-1")
   {
        req.session.user = foundUser;

        req.session.save();

        //TODO check if you need redirect here 
        res.status(200).send("Logged In. Other endpoints unlocked");
   } 
   else 
   {
        res.status(401).send("User not found. Application endpoints remain locked");
   }
});

router.get("/logout", async (req:Request, res:Response)=> 
{
    req.session.destroy((err)=> console.log(`User logged out: ${err}`)); 
    res.redirect("/")
});

module.exports = router;