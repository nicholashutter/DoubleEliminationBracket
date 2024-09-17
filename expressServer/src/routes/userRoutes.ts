import express from "express";
const router = express.Router();

import bcrypt from "bcrypt";
import { Request, Response } from "express";
import * as db from "../DbOperator";
import UserManager from "../user";
import {User} from "../user";
import BracketManager from "../Bracket";


const userManager = UserManager.getInstance;
const bracketManager = BracketManager.getInstance;

router.get("/api/getUser/:userID", (req: Request, res: Response) =>
{
    const sessionUser = userManager.getUser(req.params.userID)

    res.write(`This response should contain the userID you sent in: ${sessionUser.getUserID}. 
        If not something went wrong. `)

    res.json (sessionUser);
});

router.post("/api/createUser", (req: Request, res: Response) => 
{
    bcrypt.hash(req.body.passwordHash, 10)
        .then(function (hash)
        {
            db.updateUser(userManager.createUser(req.body.userName, hash, req.body.email));
        })
        .catch(function (error) 
        {
            console.log(error.message);
            res.send("Create User Failure");
        });


    res.send("Create User Success");
});

router.put("/api/updateUser", async (req: Request, res: Response) =>
{
   let sessionUser = req.session.user as User; 
   
   sessionUser = userManager.getUser(sessionUser.getUserID);

   userManager.updateUser(sessionUser);

   await db.updateUser(sessionUser.getUserID);

});

router.delete("/api/removeUser/:userID", async (req: Request, res: Response) => 
{

   const sessionUser = req.body.session.user as User;

   userManager.deleteUser(sessionUser.getUserID);

   await db.deleteUser(sessionUser.getUserID);
});

module.exports = router;