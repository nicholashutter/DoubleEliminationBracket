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
import userWrapper from "./user"; 

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

// Add APIs, must be after middleware
//app.use(Paths.Base);

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
// may come back and implement multithreading with workers 
  let user1 = new userWrapper("nicholas", "superuser", "nicholas.hutter@live.com");
// current logic allows for a user to be created with the input parameters, a userID to be generated,
// wrap the user in a wrapper class that validates input and handles async and returns a text 
// representation of the safe to view object fields 
  res.send(`User: ${user1.getUserName()}, UserID: ${user1.getUserId()}, Email: ${user1.getEmail()}, Created: ${user1.getCreatedAt()}`); 
});



// **** Export default **** //

export default app;
