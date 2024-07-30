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
 // const dbhandler = new DbHandler("SELECT * FROM FIGHTERS;");
});

app.route("/api/user")
.get(async (req, res) => {

  try {
    const body:body = req.body;
    const user:User = new User(body.username,body.password_hash,body.email, body.id);
    const db:DbHandler = new DbHandler();
    const rows: any = await db.readUser(user);
  
    console.log(rows);

    res.json(rows);
  }
  catch (e) {
    throw new Error ("server.ts line 87: Cannot read user possibly due to bad get request");
  }
  
  
})
.post(async (req, res)=> {
  //create user
  const body:body= req.body; 

  try{
    const user:User = new User(body.username, body.password_hash, body.email);
    const db:DbHandler = new DbHandler();


   const ifExists:undefined|User = await db.readUser(user);
    
    if (ifExists === undefined){
      db.createUser(user);
      console.log("Success"); 
      res.send("Success");
    }
    else res.send("User with similar properties already exists.");  
  }
  catch(e){
    console.log("server.ts line 105: Cannot create user possibly due to a bad post request");
  }
})
.put(async (req, res) => {
//update user 
  const body:body= req.body;
  const user = new User(body.username, body.password_hash, body.email, body.id) ;
  const db:DbHandler = new DbHandler();
  
  
  const updateWho:User = await db.readUser(user);

  /* updateWho is the full user object of who we want to update
  
      Something like:   
                    const id = updateWho.getUserID();
                    double check this logic but we always preserve the fields unless they are overridden 
                    if (updateWho.getField !== body.field)
                    {
                      updateWho.getField = username || password_hash || email 
                    }
                    await db.deleteUser(updateWho);
                    db.createUser(username, password_hash, email, id); 
      
  
  */
  
  db.updateUser(updateWho); 

  res.send("Success"); 
})
.delete((req, res) => {
  //delete user 

})

// **** Export default **** //

export default app;
