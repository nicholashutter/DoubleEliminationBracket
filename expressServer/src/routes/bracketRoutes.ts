import express from 'express';
import { Request, Response } from "express";
const router = express.Router();
import { User } from "../user";
import UserManager from '../user';
import BracketManager from '../Bracket';


router.get("/api/Bracket", (req: Request, res: Response) =>
{
    const bracketManager = BracketManager.getInstance;

    res.json(bracketManager.showAllRooms())
})

router.post("/api/Bracket", async (req: Request, res: Response) => 
{
    const userManager = UserManager.getInstance;

    const bracketManager = BracketManager.getInstance;

    let sessionUser = req.session.user as User;

    sessionUser = await userManager.getUser(sessionUser.getUserID);

    const roomCode = bracketManager.createRoom(sessionUser.getUserID);

    res.send(roomCode);
});

router.put("/api/Bracket", async (req: Request, res: Response) =>
{
    const userManager = UserManager.getInstance;

    const bracketManager = BracketManager.getInstance;

    let sessionUser = req.session.user as User;

    sessionUser = await userManager.getUser(sessionUser.getUserID);

    try
    {
        if (req.session.sessionInfo!.roomCode)
        {
            bracketManager.joinRoom(sessionUser.getUserID, req.session.sessionInfo!.roomCode)
        }
        else
        {
            throw new Error(`Invalid response from client. Possible null value or incorrect type.
                 Try sending response again. Err 012`);
        }
    }
    catch (e)
    {
        console.log(e);
    }


});

router.delete("/api/Bracket/:userID/:roomCode", async (req: Request, res: Response) => 
{
    const userManager = UserManager.getInstance;

    const bracketManager = BracketManager.getInstance;

    let sessionUser = await userManager.getUser(req.params.userID);

    bracketManager.leaveRoom(Number(req.params.userID), req.params.roomCode);
});

module.exports = router;

