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
import session from "express-session";
import { SessionManager } from "./Session";
import { v4 as uuidv4 } from "uuid";

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

/* Define custom type for user routes */
type body = {
  username: string;
  email: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
  id?: number;
};
/* Define custom type for session routes */
type sessionBody = {
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
    genid: function(req) {
      return uuidv4();
    },
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    //need to make sure cookie expires using maxAge property and cookie deletes on close of application
  })
);


//express route serves entrypoint when get request recieved at base url
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: staticDir });
});

app.post("/", (req, res) => {
  //will need to come back and integrate session regeneration
  //same logic as other routes to read database for user 


  const credentials = {username:"nicholas",
    password:"nicholas"
  }; 

  const {username, password} = req.body; 

  try {
    if (username == credentials.username && password == credentials.password) {
      req.session.user?.updateAuthenticated(); 
      res.send("Login Success");
      console.log("Login Success");
    }
    else{
      throw new Error("");
    }
  }
  catch (err) {
    res.send("Login Failed"); 
    console.log("Login Failed");
  }

});

//express route serves api demo for testing only
app.get("/api/test", async (req, res) => {
  res.send(
    "Welcome! You are in the wrong place. Try going home or try again later"
  );
});


app.post("/api/session/join", async (req, res) => {
    const body: sessionBody = req.body;

    try {
      const user: User = new User("", "", "", body.user_id);
      const db: DbHandler = new DbHandler();
      const foundUser: User = await db.readUser(user);

      switch (foundUser.getUserID()) {
        case -1: {
          throw new Error();
        }
        default: {
          const room = SessionManager.instance;
          await room.joinSession(body.sessionID, foundUser);

          res.send("Success");
        }
      }
    } catch (e) {
      console.log(e);
      res.send("Unable to join session");
    }
  })

  /*express route creates new session in database and in code */
  app.post("/api/session/create",async (req, res) => {
    const body: sessionBody = req.body;

    try {
      const user: User = new User("", "", "", body.user_id);
      const db: DbHandler = new DbHandler();
      const foundUser: User = await db.readUser(user);

      switch (foundUser.getUserID()) {
        case -1: {
          throw new Error();
        }
        default: {
          const room = SessionManager.instance;
          const sessionID = await room.createSession(foundUser);

          res.send(sessionID);
        }
      }
    } catch {
      console.log("Unable to create session;");
      res.send("failure to create session");
    }
  }); 

  app.delete("api/session/delete/:id", async (req, res) => {
    try{
      const user: User = new User("", "", "", Number(req.params.id));
      const db: DbHandler = new DbHandler();
      const foundUser:User = await db.readUser(user);

      await db.leaveSession(foundUser);
      res.send("success"); 
    }
    catch (e) {

      res.send("failure"); 
    }

  });

/*express route executes different functions based on get, post, put, delete request being recieved 
at /api/user */
//requests to /api/sessions should be formatted like custom type body

app.get("/api/user/:id",async (req, res) => {
    try {
      const user: User = new User(
        "",
        "",
        "",
        Number(req.params.id));
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
  /*express route creates a new user object
   */
app.post("api/users", async (req, res) => {
    /*
    known bug password_hash must be unique else application crashes
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
  /*express route finds and updates properties of a user object and returns once updated
   */
  app.put("/api/users", async (req, res) => {
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
  /*express route deletes user object perminately
   */
  app.delete("/api/users/:id", async (req, res) => {
    const user: User = new User(
      "",
      "",
      "",
      Number(req.params.id),
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
