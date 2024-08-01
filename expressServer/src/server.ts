
import cookieParser from "cookie-parser";
import morgan from "morgan";
import path from "path";
import helmet from "helmet";
import express, { Request, Response } from "express";
import "express-async-errors";
import EnvVars from "./common/EnvVars";
import cors from "cors";
import { NodeEnvs } from "./common/misc";
import DbHandler from "./DbHandler";
import { User } from "./user";

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

/* Define Custom Type for HTTP/JSON */
type body = {
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  id?: number;
};

// Set static directory to build directory for react allowing the index.html and index.js to be the entrypoints from here
//reactrouter takes over once entrypoint is served 
const staticDir = path.join(__dirname, "../../reactclient/build");

app.use(express.static(staticDir));

//express route serves entrypoint when get request recieved at base url 
app.get("/", (_: Request, res: Response) => {
  res.sendFile("index.html", { root: staticDir });
});

//express route serves api demo for testing only
app.get("/api/test", (_: Request, res: Response) => {
  res.send(
    "Welcome! You are in the wrong place. Try going home or try again later"
  );
});

/*express route executes different functions based on get, post, put, delete request being recieved 
at /api/user */
app
  .route("/api/user")
  /*express route executes callback that creates a user object 
  and a dbhandler object with properties retrieved from JSON body 
  when get request recieved at /api/user and calls dbhandler.readUser with 
  that object 
  If matching object database record found, return it as json
  If matching object not found, rows object will be empty except id with a value of -1
  If rows.id is -1 send a response of not found
  wrap all logic in try catch and send generic error as response if error thrown
  */
  .get(async (req, res) => {
    try {
      const body: body = req.body;
      const user: User = new User(
        body.username,
        body.password_hash,
        body.email,
        body.id
      );
      const db: DbHandler = new DbHandler();
      const rows: User = await db.readUser(user);

      if (rows.getUserID() == -1) {
        res.send("Not Found");
      }

      res.json(rows);
    } catch (e) {
      res.send(
        "server.ts line 87: Cannot read user possibly due to bad get request"
      );
      console.log(e);
    }
  })
   /*express route executes callback that creates a user object 
  and a dbhandler object with properties retrieved from JSON body 
  when post request recieved at /api/user and calls dbhandler.createUser with 
  that object 
  If object exists return object already exists operation failed
  If object does not exist Create that object as a database record
  wrap all logic in try catch and send generic error as response if error thrown
  */
  .post(async (req, res) => {
    /*
    known bug password_hash must be unique when sent in or else application will hard crash
    this is due to how passwords are currently handeled, but won't be a problem once encryption
    is integrated because all true password_hash values will be unique once they run through the 
    encryption algorithm
  */
    const body: body = req.body;

    try {
      const user: User = new User(
        body.username,
        body.password_hash,
        body.email
      );
      const db: DbHandler = new DbHandler();
      const rows: User = await db.readUser(user);

      if (rows.getUserID() == -1) {
        await db.createUser(user);
        console.log("Success");
        res.send("Success");
      } else {
        res.send("Failure. User with same properties already exists.");
      }
    } catch (e) {
      res.send(
        "server.ts line 105: Cannot create user possibly due to a bad post request"
      );
      console.log(e);
    }
  })
  /*express route executes callback that creates a user object 
  and a dbhandler object with properties retrieved from JSON body 
  when post request recieved at /api/user and calls dbhandler.readUser with 
  that object 
  Delete original user object, create new user obect with any new/changed properties
  while retaining original object id value in database
  wrap all logic in try catch and send generic error as response if error thrown
  */
  .put(async (req, res) => {
    try {
      const body: body = req.body;
      const user: User = new User(
        body.username,
        body.password_hash,
        body.email,
        body.id
      );
      const db: DbHandler = new DbHandler();
      const rows: User = await db.readUser(user);
      await db.deleteUser(rows);
      if (body.username !== undefined) {
        rows.setUserName(body.username);
      }
      if (body.password_hash !== undefined) {
        rows.setPassword_Hash(body.password_hash);
      }
      if (body.email !== undefined) {
        rows.setEmail(body.email);
      }

      await db.createUser(rows);

      res.json(rows);
    } catch (e) {
      console.log("Update Failed");
      res.send("Update Failed");
    }
  })
  /*express route executes callback that creates a user object 
  and a dbhandler object with properties retrieved from JSON body 
  Delete any object with matching properties in database
  wrap all logic in try catch and send generic error as response if error thrown
  */
  .delete(async (req, res) => {
    const body: body = req.body;
    const user: User = new User(
      body.username,
      body.password_hash,
      body.email,
      body.id
    );
    const db: DbHandler = new DbHandler();
    try {
      db.deleteUser(user);
      res.send("Success");
    } catch (e) {
      console.log("User deletion failed.");
      res.send("Failure");
    }
  });

// **** Export default **** //

export default app;
