import express from 'express';
import {Request, Response, NextFunction} from "express";
import session from 'express-session';
import bcrypt from "bcrypt"; 
const router = express.Router();
import UserManager from '../user';

export const isUserLoggedIn = (req:Request, res:Response, next:NextFunction) =>
{
    console.log(req.session);

    if (req.session.user)
    {
        console.log("User has a matching session");
        next(); 
    }
    else
    {
        console.log("User has no matching session");
        res.redirect("/login"); 
    }

}

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