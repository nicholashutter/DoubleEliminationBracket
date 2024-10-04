/* eslint-disable no-var */
import express from 'express';
import { Request, Response } from "express";
const router = express.Router();
import { User } from "../user";
import UserManager from '../user';
import BracketManager from '../Bracket';

var bracketManager = BracketManager.getInstance;
var userManager = UserManager.getInstance;

router.get("/api/Bracket", (req: Request, res: Response) =>
{
    
    res.json(bracketManager.showAllRooms());
})

router.post("/api/Bracket", async (req: Request, res: Response) => 
{

    let sessionUser = req.session.user as User;

    sessionUser = await userManager.getUser(sessionUser.getUserID);

    const roomCode = await bracketManager.createRoom(sessionUser.getUserID);

    res.send(roomCode);
});

router.put("/api/Bracket", async (req: Request, res: Response) =>
{
    
    let sessionUser = req.session.user as User;

    sessionUser = await userManager.getUser(sessionUser.getUserID);

    try
    {
        if (req.session.sessionInfo === undefined)
        {
            throw new Error("Unable to load sessionInfo from client. sessionInfo undefined.");
        }
        else if (req.session.sessionInfo.roomCode)
        {
            await bracketManager.joinRoom(sessionUser.getUserID, req.session.sessionInfo!.roomCode)
            res.status(200).send("Player removed from bracket successfully."); 
        }
        else
        {
            res.status(404).send("Unable to join player to bracket. "); 
        }
    }
    catch (e)
    {
        console.log(e);
    }

    
});

router.delete("/api/Bracket/:userID/:roomCode", async (req: Request, res: Response) => 
{
    
    const success = await bracketManager.leaveRoom(Number(req.params.userID), req.params.roomCode);

    if (success === true)
    {
        res.status(200).send("Player removed from bracket successfully."); 
    }

    else
    {
        res.status(404).send("Unable to remove player from bracket."); 
    }

});

router.put("/api/Bracket/startSinglesMatch/:roomCode", async (req: Request, res: Response) =>
{
    await bracketManager.startSinglesMatch(req.params.roomCode); 

    res.status(200).send("Starting Single Eliminaton Match with joined players"); 
}); 

router.put("/api/Bracket/startDoublesMatch/:roomCode", async (req:Request, res: Response) =>
{
    await bracketManager.startDoublesMatch(req.params.roomCode);

    res.status(200).send("Starting Double Elimination Match with joined players");
});

router.put("/api/Bracket/selectWinner/:roomCode/:winner" , async (req: Request, res: Response) =>
{
    const success = await bracketManager.selectWinner(req.params.roomCode, req.params.winner);

    if (success === true)
    {
        res.status(200).send("Winner Selected Successfully");
    }
    else
    {
        res.send(404).send("Failed to Select Round Winner"); 
    }
});





/* Use the below logical flow to write the rest of the api routes for the bracket*/ 

 /* 
        create users - done
        join users to room - done
        start match - done
        start loop - done
        start round - done
        select players - done
        select winner - done 
        end round - done
        update players - done
        end loop - done
        end match - done
        update players - done
    */

    /*
        create room, store room code
        loop
            create users 32
            join to room 
        end loop 
        start match
        start loop
            start round
            select winner
            end round
        update players
        end match
        end loop
        update players
    */

module.exports = router;

