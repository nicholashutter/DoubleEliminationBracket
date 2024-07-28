/**
 * Setup express server.
 */

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response, NextFunction} from "express";
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
const errorMiddleware = (
  err: Error,
  req: express.Request,
  res: express.Response,
  next: NextFunction
) => {
  if (EnvVars.NodeEnv !== NodeEnvs.Test.valueOf()) {
    logger.err(err, true);
  }
  let status = HttpStatusCodes.BAD_REQUEST;
  return res.status(status).json({ error: 'Error occured in middleware'});
};

app.use(errorMiddleware);



// **** Front-End Content **** //


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
.get((req, res) => {
  //read user


  /* something close to 
    body.whatever we are searching for 
  
  */





  let user = new User();
  let db = new DbHandler();

  db.readUser(user);


})
.post((req, res)=> {
  //create user
  const body = req.body;

  try{

    /*post config: POST /api/user default headers body raw JSON

    {
    "username": "micheal myers",
    "passwordHash":"willfixlater",
    "email":"bigscary@movie.site"
    }

    */

    let user = new User(body.username, body.passwordHash, body.email);
    let db = new DbHandler();
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
