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
app.get("/", (_, res) => {
    res.sendFile("index.html", { root: staticDir });
});
app.get("/api/test", (_, res) => {
    res.send("Welcome! You are in the wrong place. Try going home or try again later");
});
app.route("/api/user")
    .get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const user = new user_1.User(body.username, body.password_hash, body.email, body.id);
        const db = new DbHandler_1.default();
        const rows = yield db.readUser(user);
        if (rows === undefined) {
            res.send("Not Found");
        }
        res.json(rows);
    }
    catch (e) {
        res.send("server.ts line 87: Cannot read user possibly due to bad get request");
        console.log(e);
    }
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    try {
        const user = new user_1.User(body.username, body.password_hash, body.email);
        const db = new DbHandler_1.default();
        const ifExists = yield db.readUser(user);
        if (ifExists === undefined) {
            db.createUser(user);
            console.log("Success");
            res.send("Success");
        }
        else
            res.send("Failure");
    }
    catch (e) {
        res.send("server.ts line 105: Cannot create user possibly due to a bad post request");
    }
}))
    .put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = new user_1.User(body.username, body.password_hash, body.email, body.id);
    const db = new DbHandler_1.default();
    const updateWho = yield db.readUser(user);
    db.deleteUser(updateWho);
    if (body.username !== undefined) {
        updateWho.setUserName(body.username);
    }
    else if (body.password_hash !== undefined) {
        updateWho.setPassword_Hash(body.password_hash);
    }
    else if (body.email !== undefined) {
        updateWho.setEmail(body.email);
    }
    updateWho.setLastUpdate(new Date());
    db.createUser(updateWho);
    res.send("Success");
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const user = new user_1.User(body.username, body.password_hash, body.email, body.id);
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
