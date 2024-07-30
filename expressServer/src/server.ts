/**
 * Setup express server.
 */

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response} from "express";
import logger from "jet-logger";

import "express-async-errors";


import EnvVars from "./common/EnvVars";
import HttpStatusCodes from "./common/HttpStatusCodes";
import cors from "cors";
import { NodeEnvs } from "./common/misc";
import DbHandler from "./DbHandler";
import {User} from "./user";
// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));
const corsOptions: cors.CorsOptions = {
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf()) {
  app.use(morgan("dev"));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
  app.use(helmet());
}

// Add error handler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));

/* Define Custom Types for HTTP */
type body = {
  username: string,
  email:string, 
  passwordHash: string, 
  created_at:Date, 
  updated_at:Date
}

// Set static directory (js and css). //I have set this to build directory for react allowing the index.html and index.js to be the entrypoints from here
//reactrouter should take over once this page is served
const staticDir = path.join(__dirname, "../../reactclient/build");

app.use(express.static(staticDir));

app.get("/", (_: Request, res: Response) => {
  res.sendFile("index.html", { root: staticDir });
});

app.get("/api/test",  (_: Request, res: Response) => {
 // const dbhandler = new DbHandler("SELECT * FROM FIGHTERS;");
});

app.route("/api/user")
.get(async (req, res) => {
  //read user


  /* logic is broken some sort of type argument mismatch 
  between request.body, dbhandler, user, and server
  
  Either refactor to search without requiring the entire user object 
  be pass into DbHandler.readUser or track down through debugger exactly
  where properties fall out and become null
  Your SQL query works you just aren't sending anything valid
  to the database and therefor you can't return undefined which is why 
  typescript currently crashes 
  */
  const body:body = req.body;
  const user:User = new User(body.username, body.passwordHash, body.email);
  const db:DbHandler = new DbHandler();

  //explicit any will be used here because 
  const rows: any = await db.readUser(user);

  console.log(rows);
  
  res.json(rows);
})
.post((req, res)=> {
  //create user
  const body = req.body;

  try{
    const user = new User(body.username, body.passwordHash, body.email);
    const db = new DbHandler();
    db.createUser(user);
    console.log("Success"); 
    res.send("Success");
  }
  catch(e){
    console.log("server.ts line 95: Cannot create user possibly due to a bad post request");
  }
  
  

})
.put((req, res) => {
//update user 

})
.delete((req, res) => {
  //delete user 

})

// **** Export default **** //

export default app;
