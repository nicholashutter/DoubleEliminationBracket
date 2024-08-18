import express from "express";
import EnvVars from "./common/EnvVars";
import path from "path";
import cors from "cors";
import "express-async-errors";
import helmet from "helmet";
import { NodeEnvs } from "./common/misc";
import session from "express-session";
import BracketManager from "./Bracket";
import UserManager from "./user";
import * as DbOperator from "./DbOperator"

const authRoutes = require("./routes/authenticationRoute");
const bracketRoutes = require("./routes/bracketRoutes");
const userRoutes = require("./routes/userRoutes");

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
    secret: "Gyb|MTqq%YW(`N$86a5+K]tHCQ9}2Ilj2354opiuasfd1423",
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
