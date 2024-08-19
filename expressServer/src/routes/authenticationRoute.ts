import express from 'express';
import {Request, Response} from "express";
import session from 'express-session';
import bcrypt from "bcrypt"; 
const router = express.Router();

router.get("/login", (req:Request, res:Response )=>
    {
        /* TODO
        should return whether session is valid or not
        based on userID
        done with req.params 
        */
    });

router.post("/login", (req:Request, res:Response) => 
{
    /* TODO
    logic to login new user if no valid session, 
    redirect to home page if valid session
    done with req.BODY
    */
   
});

router.delete("/api/logout", (req:Request, res:Response)=> 
{
    /* TODO
    logic to manually destroy session but not
    user properties in database 
    done with req.params
    */
});

module.exports = router;