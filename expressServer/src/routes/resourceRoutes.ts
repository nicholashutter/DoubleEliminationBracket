// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("node:path");
import express from 'express';
import { Request, Response } from "express";
const router = express.Router();

router.use("express", express.static( path.join (__dirname, "../public")));

router.get("/api/fetchBackground", (req: Request, res: Response) =>
{
    
    res.sendFile(path.join(__dirname, "../public", "/smash.png"));

   // D:\Development\Javascript\tourneyApp\expressServer\src\public\smash.png
})

module.exports = router;

