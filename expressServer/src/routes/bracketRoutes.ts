import express from 'express';
import {Request, Response} from "express";
const router = express.Router();
import {User} from "../user";
import UserManager from '../user';
import BracketManager from '../Bracket';

const userManager =  UserManager.getInstance; 
const bracketManger = BracketManager.getInstance;

router.get("/api/getBracket", (req:Request, res:Response )=>
    {
        /* TODO
        logic to return selected bracket,
        done with req.params
        */
    });

router.post("/api/createBracket", (req:Request, res:Response) => 
{
    /*
        foundUser = userManager.getUser(req.session.user.id);
        roomCode = bracketManager.createBracket(foundUser.getUserID); 

        res.send(roomCode)

    */
});

router.put("/api/joinBracket", (req:Request, res:Response) =>
{
    /* TODO
    logic to get current brackets by bracketID, 
    return the one searched ifExists, 
    add the selected player to selected bracket ,
    done with req.BODY
    */
});

router.delete("/api/leaveBracket", (req:Request, res:Response)=> 
{
    /* TODO
    logic to get current bracket by bracketID, 
    return the one searched ifExists, 
    logic to check if user in selected bracket, 
    remove user from bracket ifExists, 
    done with req.params
    */
});

module.exports = router;

