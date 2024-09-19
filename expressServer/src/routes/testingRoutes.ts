/* eslint-disable no-var */
import express from 'express';
import { Request, Response } from "express";
const router = express.Router();
import { User } from "../user";
import UserManager from '../user';
import BracketManager from '../Bracket';
import * as db from "../DbOperator"

var userManager = UserManager.getInstance;
var bracketManager = BracketManager.getInstance;

router.get("/test/DB", async (req: Request, res: Response) =>
{
 

  res.status(200).send()
});


module.exports = router;


