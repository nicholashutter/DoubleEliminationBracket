import express from "express";
import EnvVars from "./common/EnvVars";
import path from "path";
import "express-async-errors";
import helmet from "helmet";
import { NodeEnvs } from "./common/misc";
import session from "express-session";
import BracketManager from "./Bracket";
import UserManager from "./user";
import { readUser, updateUser, deleteUser } from "./DbOperator"

/*
TODO learn common module so you can export a file of functions and access them using filename.function  
You will want to use that to export DbOperator and when you write your route files 
*/

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

//Include express-session
app.use(
  session({
    name: "Tournament Session",
    secret: "Gyb|MTqq%YW(`N$86a5+K]tHCQ9}2I",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10800000 },
    rolling: true
    // TODO need to make sure cookie expires using maxAge property and cookie deletes on close of application
  })
);

// Security
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf())
{
  app.use(helmet());
}


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
