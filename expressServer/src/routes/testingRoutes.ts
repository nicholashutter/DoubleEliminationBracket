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

router.get("/test/DeleteUser", async (req: Request, res: Response) =>
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

router.get("/test/CreateRoom", async (req: Request, res: Response) =>
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

router.get("/test/JoinRoom", async (req: Request, res: Response) =>
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

router.get("/test/LeaveRoom", async (req: Request, res: Response) =>
{
  const roomCode = bracketManager.createRoom(userManager.createUser('', '', ''));
  for (let i = 0; i < 1000; i++)
  {

    console.log("running");
    userManager.createUser(`${i}`, `${i}`, `${i}`, i);
    bracketManager.joinRoom(i, roomCode);

    bracketManager.leaveRoom(i, roomCode);
  }

  console.log(bracketManager.showAllRooms());

  console.log("test complete");

  res.status(200).send()
});

router.get("/test/GetUser/string", async (req: Request, res: Response) =>
{
  let counter = 0; 
  for (let i = 0; i < 1000; i++)
  {

    console.log("running");
    userManager.createUser(`User ${i}`, `PW ${i}`, `Email ${i}`);
    
    const foundUser = userManager.getUser(`User ${i}`);

    if (foundUser.getUserName == `{i}`)
    {
      counter++;
      if (i == 999)
      {
        console.log(`Successfully found ${counter} users`);
      }
    }
  }
  console.log("test complete");

  res.status(200).send()
});

router.get("/test/GetUser/insertID", async (req: Request, res: Response) =>
  {
    let counter = 0; 
    for (let i = 0; i < 1000; i++)
    {
  
      console.log("running");
      userManager.createUser(`User ${i}`, `PW ${i}`, `Email ${i}`, i);
      
      const foundUser = userManager.getUser(i);
  
      if (foundUser.getUserID == i)
      {
        counter++;
        if (i == 999)
        {
          console.log(`Successfully found ${counter} users`);
        }
      }
    }
    console.log("test complete");
  
    res.status(200).send()
  });

  router.get("/test/GetUser/generateID", async (req: Request, res: Response) =>
    {
      let counter = 0; 
      for (let i = 0; i < 1000; i++)
      {
    
        console.log("running");
        const userID = userManager.createUser(`User ${i}`, `PW ${i}`, `Email ${i}`);
        
        const foundUser = userManager.getUser(userID);
    
        if (foundUser.getUserID == userID)
        {
          counter++;
          if (i == 999)
          {
            console.log(`Successfully found ${counter} users`);
          }
        }
      }
      console.log("test complete");
    
      res.status(200).send()
    });
module.exports = router;