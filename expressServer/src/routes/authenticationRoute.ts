import express from "express";
import { Request, Response } from "express";
import UserManager from "../user";
const router = express.Router();

router.get("/login", (req: Request, res: Response) =>
{
    res.status(400).send(`Invalid request method: GET`);
});

router.post("/login", async (req: Request, res: Response) => 
{

    const userManager: UserManager = UserManager.getInstance;


    const foundUser = userManager.getUser(req.body.userName);

    if (foundUser.getUserName != "-1")
    {
        req.session.user = foundUser;

        req.session.save();

        
        res.status(200).send("Logged In. Other endpoints unlocked");

        // TODO send application here 
    }
    else 
    {
        res.status(401).send("User not found. Application endpoints remain locked");
    }
});

router.get("/logout", async (req: Request, res: Response) => 
{
    req.session.destroy((err) => console.log(`User logged out: ${err}`));
    res.redirect("/")
});

module.exports = router;