import express from 'express';
import { Request, Response } from "express";
const router = express.Router();
import { User } from "../user";
import UserManager from '../user';
import BracketManager from '../Bracket';
import * as db from "../DbOperator"

router.get("/testDB", async (req: Request, res: Response) =>
    {
      const testCreate = () =>
      {
        const userManager = UserManager.getInstance;
        for (let i = 0; i < 1000; i++)
        {
          userManager.createUser(`${i}`, `${i}`, `${i}`, i);
          db.updateUser(i);
        }
      }
    
      const testDelete = () =>
      {
        for (let i = 0; i < 1000; i++)
        {
          setTimeout(async () =>
          {
            const res: any = await db.deleteUser(i);
    
            console.log("running test");

          }, 2000);
          
        }
      }
      testCreate();
      testDelete();

      console.log("test complete"); 
      
      res.status(200).send()
    });

module.exports = router;