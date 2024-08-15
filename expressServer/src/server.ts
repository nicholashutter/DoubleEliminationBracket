import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express from "express";
import "express-async-errors";
import EnvVars from "./common/EnvVars";
import cors from "cors";
import { NodeEnvs } from "./common/misc";
import session from "express-session";

import DbHandler from "./DbOperator";
import UserManager from "./user";
import SessionManager from "./Session";
import { readUser, updateUser, deleteUser } from "./DbOperator"

// **** Variables **** //

const app = express();

// **** Setup **** //

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(EnvVars.CookieProps.Secret));
const corsOptions: cors.CorsOptions = 
{
  origin: "http://localhost:3000",
};
app.use(cors(corsOptions));

// Show routes called in console during development
if (EnvVars.NodeEnv === NodeEnvs.Dev.valueOf())
{
  app.use(morgan("dev"));
}

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf())
{
  app.use(helmet());
}

// Add error handler
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//trying to comment out to see if anything breaks
// app.use(cookieParser(EnvVars.CookieProps.Secret));

/* Define custom type for user routes */

// TODO rename this more specifically
type body = 
{
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  id?: number;
};
/* Define custom type for session routes */

// TODO rename this more specifically
type sessionBody = 
{
  sessionID: string;
  user_id: number;
};

// Set static directory to build directory for react allowing the index.html and index.js to be the entrypoints from here
//reactrouter takes over once entrypoint is served
const staticDir = path.join(__dirname, "../../reactclient/build");

app.use(express.static(staticDir));

//Include express-session
app.use(
  session({
    name: "Tournament Session",
    secret: "Gyb|MTqq%YW(`N$86a5+K]tHCQ9}2I",
    genid: () =>
    {
      return "" // TODO use this to get Session manager and call SessionManager.createSession;
    },
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    // TODO need to make sure cookie expires using maxAge property and cookie deletes on close of application
  })
);


//express route serves entrypoint when get request recieved at base url
app.get("/", (req, res) =>
{
  res.sendFile("index.html", { root: staticDir });
});

//TODO rewrite w encryption
app.post("/login", (req, res) =>
{

  const credentials = {
    username: "nicholas",
    password: "nicholas"
  };

  const { username, password } = req.body;

  try
  {
    if (username == credentials.username && password == credentials.password)
    {
      req.session.user?.updateAuthenticated();
      res.send("Login Success");
      console.log("Login Success");
    }
    else
    {
      throw new Error("");
    }
  }
  catch (err)
  {
    res.send("Login Failed");
    console.log("Login Failed");
  }

});

/* 
    TODO app.route(api/bracket)
*/

/* 
    TODO app.route(api/user)
*/



// **** Export default **** //

export default app;
