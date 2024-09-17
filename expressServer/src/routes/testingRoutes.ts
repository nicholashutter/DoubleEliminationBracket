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

router.get("/testDeleteUser", async (req: Request, res: Response) =>
{
  for (let i = 0; i < 1000; i++)
  {
    userManager.createUser(`${i}`, `${i}`, `${i}`, i);
  }


  for (let i = 1000; i > 0; i--)
  {
    userManager.deleteUser(i);
    console.log("running");
  }

  userManager.showAllUsers();

  console.log("test complete");

  res.status(200).send()
});

router.get("/testCreateRoom", async (req: Request, res: Response) =>
{
  for (let i = 0; i < 1000; i++)
  {
    userManager.createUser(`${i}`, `${i}`, `${i}`, i);
  }


  for (let i = 0; i < 1000; i++)
  {
    const roomCode = bracketManager.createRoom(userManager.createUser(`user${i}`, `pw${i}`, `email${i}`));
    console.log("running");

  }

  console.log(bracketManager.showAllRooms());

  console.log("test complete");

  res.status(200).send()
});

router.get("/testJoinRoom", async (req: Request, res: Response) =>
{
  
  for (let i = 0; i < 1000; i++)
  {
    const roomCode = bracketManager.createRoom(userManager.createUser('', '', ''));
    console.log("running");
    userManager.createUser(`${i}`, `${i}`, `${i}`, i);
    bracketManager.joinRoom(i, roomCode);
  }

  console.log(bracketManager.showAllRooms());

  console.log("test complete");

  res.status(200).send()
});

module.exports = router;