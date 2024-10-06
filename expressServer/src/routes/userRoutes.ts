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

router.get("/api/getUser/:userID", async (req: Request, res: Response) =>
{
    const sessionUser = await userManager.getUser(req.params.userID)

    res.write(`This response should contain the userID you sent in: ${sessionUser.getUserID}. 
        If not something went wrong. `)

    res.json (sessionUser);
});


router.post("/api/createUser",  (req: Request, res: Response) => 
{
    bcrypt.hash(req.body.passwordHash, 10)
        .then(function (hash)
        {
            db.updateUser(userManager.createUser(req.body.userName, hash, req.body.email));
            res.redirect("/");

        })
        .catch(function (error) 
        {
            console.log(error.message);
            res.status(404).send("Create User Failure");
        });


    
});
 
router.put("/api/updateUser", async (req: Request, res: Response) =>
{
   let sessionUser = req.session.user as User; 
   
   sessionUser = await userManager.getUser(sessionUser.getUserID);

   const success = await userManager.updateUser(sessionUser);

   await db.updateUser(sessionUser.getUserID);

   if (success === true)
   {
    res.status(200).send("User updated successfully");
   }
   else
   {
    res.status(404).send("User update failed"); 
   }

   

});

router.delete("/api/removeUser/:userID", async (req: Request, res: Response) => 
{

   const sessionUser = req.body.session.user as User;

   const success = userManager.deleteUser(sessionUser.getUserID);

   await db.deleteUser(sessionUser.getUserID);

   if (success === true)
    {
     res.status(200).send("User Deleted Successfully");
    }
    else
    {
     res.status(404).send("Failed to Delete User"); 
    }
});

export default router;