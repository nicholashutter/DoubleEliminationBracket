import express from 'express';
import {Request, Response} from "express";
const router = express.Router();

router.get("/api/getBracket", (req:Request, res:Response )=>
    {
        /* TODO
        logic to return selected bracket,
        done with req.params
        */
    });

router.post("/api/createBracket", (req:Request, res:Response) => 
{
    /* TODO
    logic to create new bracket, enter sent user, 
    return bracketID, done with json request.BODY
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

