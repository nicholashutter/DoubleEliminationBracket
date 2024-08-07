"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const EnvVars_1 = __importDefault(require("./common/EnvVars"));
const cors_1 = __importDefault(require("cors"));
const misc_1 = require("./common/misc");
const DbHandler_1 = __importDefault(require("./DbHandler"));
const user_1 = require("./user");
const express_session_1 = __importDefault(require("express-session"));
const Session_1 = require("./Session");
const uuid_1 = require("uuid");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)(EnvVars_1.default.CookieProps.Secret));
const corsOptions = {
    origin: "http://localhost:3000",
};
app.use((0, cors_1.default)(corsOptions));
if (EnvVars_1.default.NodeEnv === misc_1.NodeEnvs.Dev.valueOf()) {
    app.use((0, morgan_1.default)("dev"));
}
if (EnvVars_1.default.NodeEnv === misc_1.NodeEnvs.Production.valueOf()) {
    app.use((0, helmet_1.default)());
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)(EnvVars_1.default.CookieProps.Secret));
const staticDir = path_1.default.join(__dirname, "../../reactclient/build");
app.use(express_1.default.static(staticDir));
app.use((0, express_session_1.default)({
    name: "Tournament Session",
    secret: "Gyb|MTqq%YW(`N$86a5+K]tHCQ9}2I",
    genid: function (req) {
        return (0, uuid_1.v4)();
    },
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.get("/", (req, res) => {
    res.sendFile("index.html", { root: staticDir });
});
app.post("/", (req, res) => {
    var _a;
    const credentials = 'nicholas';
    const { username, password } = req.body;
    try {
        if (username && password === credentials) {
            (_a = req.session.user) === null || _a === void 0 ? void 0 : _a.updateAuthenticated();
            res.send("Login Success");
        }
        else {
            throw new Error("");
        }
    }
    catch (err) {
        res.send(alert("Login Failed"));
    }
});
app.get("/api/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Welcome! You are in the wrong place. Try going home or try again later");
}));
app.post("/api/session/join", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = new user_1.User("", "", "", body.user_id);
        const db = new DbHandler_1.default();
        const foundUser = yield db.readUser(user);
        switch (foundUser.getUserID()) {
            case -1: {
                throw new Error();
            }
            default: {
                const room = Session_1.SessionManager.instance;
                yield room.joinSession(body.sessionID, foundUser);
                res.send("Success");
            }
        }
    }
    catch (e) {
        console.log(e);
        res.send("Unable to join session");
    }
}));
app.post("/api/session/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = new user_1.User("", "", "", body.user_id);
        const db = new DbHandler_1.default();
        const foundUser = yield db.readUser(user);
        switch (foundUser.getUserID()) {
            case -1: {
                throw new Error();
            }
            default: {
                const room = Session_1.SessionManager.instance;
                const sessionID = yield room.createSession(foundUser);
                res.send(sessionID);
            }
        }
    }
    catch (_a) {
        console.log("Unable to create session;");
        res.send("failure to create session");
    }
}));
app.delete("api/session/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_1.User("", "", "", Number(req.params.id));
        const db = new DbHandler_1.default();
        const foundUser = yield db.readUser(user);
        yield db.leaveSession(foundUser);
        res.send("success");
    }
    catch (e) {
        res.send("failure");
    }
}));
app.get("/api/user/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_1.User("", "", "", Number(req.params.id));
        const db = new DbHandler_1.default();
        const rows = yield db.readUser(user);
        if (rows.getUserID() == -1) {
            res.send("Not Found");
        }
        res.json(rows);
    }
    catch (e) {
        res.send("server.ts line 87: Cannot read user possibly due to bad get request");
        console.log(e);
    }
}));
app.post("api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = new user_1.User(body.username, body.password_hash, body.email);
        const db = new DbHandler_1.default();
        const rows = yield db.readUser(user);
        if (rows.getUserID() == -1) {
            yield db.createUser(user);
            console.log("Success");
            res.send("Success");
        }
        else {
            res.send("Failure. User with same properties already exists.");
        }
    }
    catch (e) {
        res.send("server.ts line 105: Cannot create user possibly due to a bad post request");
        console.log(e);
    }
}));
app.put("/api/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = new user_1.User(body.username, body.password_hash, body.email, body.id);
        const db = new DbHandler_1.default();
        const rows = yield db.readUser(user);
        yield db.deleteUser(rows);
        if (body.username !== undefined) {
            rows.setUserName(body.username);
        }
        if (body.password_hash !== undefined) {
            rows.setPassword_Hash(body.password_hash);
        }
        if (body.email !== undefined) {
            rows.setEmail(body.email);
        }
        yield db.createUser(rows);
        res.json(rows);
    }
    catch (e) {
        console.log("Update Failed");
        res.send("Update Failed");
    }
}));
app.delete("/api/users/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = new user_1.User("", "", "", Number(req.params.id));
    const db = new DbHandler_1.default();
    try {
        db.deleteUser(user);
        res.send("Success");
    }
    catch (e) {
        console.log("User deletion failed.");
        res.send("Failure");
    }
}));
exports.default = app;
