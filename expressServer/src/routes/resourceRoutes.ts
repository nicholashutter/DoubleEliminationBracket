// eslint-disable-next-line @typescript-eslint/no-var-requires

import path from "node:path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import express from 'express';
import { Request, Response } from "express";
const router = express.Router();

router.use("express", express.static( path.join (__dirname, "../public")));

router.get("/api/fetchBackground", (req: Request, res: Response) =>
{
    
    res.sendFile(path.join(__dirname, "../public", "/smash.png"));

   /*
   --> This entire file will likely be deprecated
   */
})

export default router;

