import express from 'express';
const router = express.Router();

import {Request, Response} from "express";
import * as db from "../DbOperator";
import UserManager from "../user";
import BracketManager from "../Bracket";

const userManager = UserManager.getInstance;
const bracketManager = BracketManager.getInstance;

router.get("/api/getUser", (req:Request, res:Response )=>
    {
        /* TODO
        logic to return selected user,
        done with req.params
        */
    });

router.post("/api/createUser", (req:Request, res:Response) => 
{
    /* TODO
            Also need to establish a session and reroute to create or join tourney 
            If new user, then session.authentication = true
    */
    try 
    {
        db.updateUser(userManager.createUser(req.body.userName, req.body.passwordHash, req.body.email));
    }
    catch (err) 
    {
        console.log(err);
        res.send("Create User Failed"); 

    }
    res.send("Create User Success");
});

router.put("/api/updateUser", (req:Request, res:Response) =>
{
    /* TODO
    logic to get selected user, copy all properties, 
    create new user with updated properties, 
    copy all non updated properties, 
    delete original user, upload replacement user to 
    database, done with json request.BODY
    */
});

router.delete("/api/removeUser", (req:Request, res:Response)=> 
{
    /* TODO
    logic to get selected user, delete them, 
    delete from datatbase
    done with req.params
    */
});

module.exports = router;