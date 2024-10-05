var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from "express";
import session from "express-session";
import EnvVars from "./common/EnvVars";
import cors from "cors";
import "express-async-errors";
import helmet from "helmet";
import { NodeEnvs } from "./common/misc";
import UserManager from './user';
import bcrypt from "bcrypt";
const path = require('node:path');
const bracketRoutes = require("./routes/bracketRoutes");
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const testingRoutes = require("./routes/testingRoutes");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: "http://localhost:3000",
};
app.use(cors(corsOptions));
app.use(session({
    name: "Tournament Session",
    secret: "Gyb|MTqq%YWN$86a5+K]tHCQ9}2Ilj2354opiuasfd1423",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10800000 },
    rolling: true
}));
if (EnvVars.NodeEnv === NodeEnvs.Production.valueOf()) {
    app.use(helmet());
}
const staticDir = path.join(__dirname, "../../reactclient/build");
app.use(express.static(path.join(__dirname, "../../reactclient/build")));
app.use(resourceRoutes);
const validateLogin = function (req, res, next) {
    console.log(req.session);
    if (req.session.user) {
        console.log("User has a matching session Err 021");
        res.status(200).write("User has a matching session Err 022");
        next();
    }
    else {
        console.log("User has no matching session Err 020");
        res.status(200).send();
    }
};
app.get("/login", (req, res) => {
    res.status(200).sendFile("index.html", { root: staticDir });
});
app.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userManager = UserManager.getInstance;
    const foundUser = yield userManager.getUser(req.body.userName);
    if (foundUser.getUserName != "-1") {
        const passwordHash = foundUser.getPasswordHash;
        const match = yield bcrypt.compare(req.body.passwordHash, passwordHash);
        if (match) {
            req.session.user = foundUser;
            req.session.save();
            res.status(200).redirect("/");
        }
        else {
            res.status(401).send("Password not found. Application endpoints remain locked");
        }
    }
    else {
        res.status(401).send("User not found. Application endpoints remain locked");
    }
}));
app.get("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.session.destroy((err) => console.log(`User logged out: ${err}`));
    res.redirect("/login");
}));
app.use(validateLogin);
app.get("/", (req, res) => {
    res.redirect("/login");
});
app.use(bracketRoutes);
app.use(userRoutes);
export default app;
//# sourceMappingURL=server.js.map