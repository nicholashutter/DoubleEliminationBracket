"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const jet_logger_1 = __importDefault(require("jet-logger"));
require("express-async-errors");
const EnvVars_1 = __importDefault(require("./common/EnvVars"));
const HttpStatusCodes_1 = __importDefault(require("./common/HttpStatusCodes"));
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
const errorMiddleware = (err, req, res, next) => {
    if (EnvVars_1.default.NodeEnv !== misc_1.NodeEnvs.Test.valueOf()) {
        jet_logger_1.default.err(err, true);
    }
    let status = HttpStatusCodes_1.default.BAD_REQUEST;
    return res.status(status).json({ error: 'Error occured in middleware' });
};
app.use(errorMiddleware);
const staticDir = path_1.default.join(__dirname, "../../reactclient/build");
app.use(express_1.default.static(staticDir));
app.get("/", (_, res) => {
    res.sendFile("index.html", { root: staticDir });
});
app.get("/api/test", (_, res) => {
});
app.route("/api/user")
    .get((req, res) => {
})
    .post((req, res) => {
    let user = new user_1.User("superuser", "superuser", "superuser@website.com");
    let db = new DbHandler_1.default();
    db.createUser(user);
})
    .put((req, res) => {
})
    .delete((req, res) => {
});
exports.default = app;
