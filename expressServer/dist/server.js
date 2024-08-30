"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.expressPath = exports.reactPath = void 0;
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const EnvVars_1 = __importDefault(require("./common/EnvVars"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
require("express-async-errors");
const helmet_1 = __importDefault(require("helmet"));
const misc_1 = require("./common/misc");
const Bracket_1 = __importDefault(require("./Bracket"));
const user_1 = __importDefault(require("./user"));
exports.reactPath = "../../reactclient/build";
exports.expressPath = "./public";
const authRoutes = require("./routes/authenticationRoute");
const bracketRoutes = require("./routes/bracketRoutes");
const userRoutes = require("./routes/userRoutes");
const userManager = user_1.default.getInstance;
const bracketManager = Bracket_1.default.getInstance;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const corsOptions = {
    origin: "http://localhost:3000",
};
app.use((0, cors_1.default)(corsOptions));
app.use("/react", express_1.default.static(path_1.default.join(__dirname, exports.reactPath)));
app.use("/express", express_1.default.static(path_1.default.join(__dirname, exports.expressPath)));
app.use((0, express_session_1.default)({
    name: "Tournament Session",
    secret: "Gyb|MTqq%YWN$86a5+K]tHCQ9}2Ilj2354opiuasfd1423",
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 10800000 },
    rolling: true
}));
if (EnvVars_1.default.NodeEnv === misc_1.NodeEnvs.Production.valueOf()) {
    app.use((0, helmet_1.default)());
}
app.use(authRoutes);
const validateLogin = function (req, res, next) {
    console.log(req.session);
    if (req.session.user) {
        console.log("User has a matching session Err 021");
        res.status(200).write("User has a matching session Err 022");
        next();
    }
    else {
        console.log("User has no matching session Err 020");
        res.status(401).redirect("/login");
    }
};
app.use(validateLogin);
app.get("/", (req, res) => {
    res.redirect("./login");
});
app.use(bracketRoutes);
app.use(userRoutes);
exports.default = app;
