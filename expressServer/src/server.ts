/* eslint-disable @typescript-eslint/no-var-requires */

import express from "express";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import EnvVars from "./common/EnvVars";
import cors from "cors";
import "express-async-errors";
import helmet from "helmet";
import { NodeEnvs } from "./common/misc";
import BracketManager from "./Bracket";
import UserManager from './user';
import bcrypt from "bcrypt";
import * as db from "./DbOperator";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


import path from 'node:path';
import bracketRoutes from "./routes/bracketRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import testingRoutes from "./routes/testingRoutes.js"; 


export interface SessionInfo
{
  roomCode?: string;
}

/*
Create web server, respond to HTTP requests 
*/
const app = express();


// **** Middleware **** //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions: cors.CorsOptions =
{
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

//Include express-session
app.use(
  session({
    name: "Tournament Session",
    secret: "Gyb|MTqq%YWN$86a5+K]tHCQ9}2Ilj2354opiuasfd1423",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10800000 },
    rolling: true
  })
);

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf())
{
  app.use(helmet());
}


const staticDir = path.join(__dirname, "../../reactclient/build");
app.use(express.static(path.join(__dirname, "../../reactclient/build")));


app.use(resourceRoutes);

// Authentication
const validateLogin = function (req: Request, res: Response, next: NextFunction)
{
  console.log(req.session);

  if (req.session.user)
  {
    console.log("User has a matching session Err 021");
    res.status(200).write("User has a matching session Err 022");
    next();
  }
  else
  {
    console.log("User has no matching session Err 020");

    res.status(200).send(); 

    //res.status(401).redirect("/login");
    
  }

}

// **** Routing **** //

app.get("/login", (req: Request, res: Response) =>
{
  res.status(200).sendFile("index.html", {root:staticDir}); 

});

app.post("/login", async (req: Request, res: Response) => 
{

  const userManager: UserManager = UserManager.getInstance;


  const foundUser = await userManager.getUser(req.body.userName);

  if (foundUser.getUserName != "-1")
  {
    const passwordHash = foundUser.getPasswordHash;
    const match = await bcrypt.compare(req.body.passwordHash, passwordHash);

    if (match)
    {
      req.session.user = foundUser;

      req.session.save();

      res.status(200).redirect("/"); 

    }
    else 
    {
      res.status(401).send("Password not found. Application endpoints remain locked");
    }
  }
  else 
  {
    res.status(401).send("User not found. Application endpoints remain locked");
  }
});

app.get("/logout", async (req: Request, res: Response) => 
{
  req.session.destroy((err) => console.log(`User logged out: ${err}`));
  res.redirect("/login")
});

//app.use(testingRoutes);


app.use(validateLogin);


app.get("/", (req, res) =>
  {
    res.redirect("/login");
  });

app.use(bracketRoutes);

app.use(userRoutes);


// **** Export default **** //

export default app;
