/**
 * Setup express server.
 */

import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response} from "express";
import "express-async-errors"
import EnvVars from "./common/EnvVars";
import cors from "cors";
import { NodeEnvs } from "./common/misc";
import DbHandler from "./DbHandler";
import {User, IUser} from "./user";

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
  password_hash: string, 
  created_at:Date, 
  updated_at:Date,
  id?:number
}

// Set static directory (js and css). //I have set this to build directory for react allowing the index.html and index.js to be the entrypoints from here
//reactrouter should take over once this page is served
const staticDir = path.join(__dirname, "../../reactclient/build");

app.use(express.static(staticDir));

app.get("/", (_: Request, res: Response) => {
  res.sendFile("index.html", { root: staticDir });
});

app.get("/api/test",  (_: Request, res: Response) => {
 res.send("Welcome! You are in the wrong place. Try going home or try again later");
});

app.route("/api/user")
.get(async (req, res) => {

  try {
    const body:body = req.body;
    const user:User = new User(body.username,body.password_hash,body.email, body.id);
    const db:DbHandler = new DbHandler();
    const rows:User = await db.readUser(user);

    if (rows.getUserID() == -1){
      res.send("Not Found"); 
    }

    res.json(rows);
  }
  catch (e) {
    res.send("server.ts line 87: Cannot read user possibly due to bad get request");
    console.log(e);
  }
  
  
})
.post(async (req, res)=> {
  //create user

  /*
    known bug password_hash must be unique when sent in or else application will hard crash
    this is due to how passwords are currently handeled, but won't be a problem once encryption
    is integrated because all true password_hash values will be unique once they run through the 
    encryption algorithm
  */
  const body:body= req.body; 

  try{

      const user:User = new User(body.username, body.password_hash, body.email);
      const db:DbHandler = new DbHandler();
      const rows:User = await db.readUser(user);

      if (rows.getUserID() == -1)
      {
        await db.createUser(user);
        console.log("Success"); 
        res.send("Success");
        
      }
      else
      {
        res.send("Failure. User with same properties already exists.");
      }
    
  }
  catch(e){
    res.send("server.ts line 105: Cannot create user possibly due to a bad post request")
    console.log(e);
  }
})
.put(async (req, res) => {
//update user 
try {
  const body:body = req.body;
  const user:User = new User(body.username,body.password_hash,body.email, body.id);
  const db:DbHandler = new DbHandler();
  const rows:User = await db.readUser(user);
  await db.deleteUser(rows); 
  if (body.username !== undefined)
  {
    rows.setUserName(body.username); 
  }
  if (body.password_hash !== undefined)
  {
    rows.setPassword_Hash(body.password_hash);
  }
  if (body.email !== undefined)
  {
    rows.setEmail(body.email);
  }
  
  await db.createUser(rows);
  
  res.json (rows);
}
catch (e){
  console.log("Update Failed");
  res.send("Update Failed");
}

})
.delete(async (req, res) => {
  //delete user 
const body:body= req.body;
const user:User = new User(body.username, body.password_hash, body.email, body.id)
const db:DbHandler = new DbHandler();
try {
  db.deleteUser(user);
  res.send("Success"); 
}
catch (e){
  console.log("User deletion failed.")
  res.send("Failure")
}

})

// **** Export default **** //

export default app;
