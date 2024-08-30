/* eslint-disable @typescript-eslint/no-var-requires */

import express from "express";
import session from "express-session";
import { Request, Response, NextFunction } from "express";
import EnvVars from "./common/EnvVars";
import path from "path";
import cors from "cors";
import "express-async-errors";
import helmet from "helmet";
import { NodeEnvs } from "./common/misc";
import BracketManager from "./Bracket";
import UserManager from "./user";


const authRoutes = require("./routes/authenticationRoute");
const bracketRoutes = require("./routes/bracketRoutes");
const userRoutes = require("./routes/userRoutes");

export interface SessionInfo
{
  roomCode?: string;
}

/*
Create web server, respond to HTTP requests 
Only server creates users, brackets and express sessions
*/

// **** Variables **** //


const userManager = UserManager.getInstance;
const bracketManager = BracketManager.getInstance;


const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions: cors.CorsOptions =
{
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// Set static directory to build directory for react allowing the index.html and index.js to be the entrypoints from here
//reactrouter takes over once entrypoint is served


app.use(express.static(path.join(__dirname, "../../reactclient/build")));

app.use(express.static(path.join(__dirname, "./public")));


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

//middleware checking for valid credentials at each api endpoint
const validateLogin = function (req: Request, res: Response, next: NextFunction)
{
  console.log(req.session);

  if (req.session.user)
  {
    console.log("User has a matching session");

    next();
  }
  else
  {
    console.log("User has no matching session");

    res.redirect("/login");
  }

}

app.use(validateLogin);

//express route serves entrypoint when get request recieved at base url
app.get("/", (req, res) =>
{
  res.sendFile("./public/HomePage.html");
});


/* 
    app.route(api/bracket)
*/
app.use(bracketRoutes);

/* 
    app.route(api/user)
*/
app.use(userRoutes);


/* 
    app.route(/login /logout )
*/
app.use(authRoutes);

// **** Export default **** //

export default app;
