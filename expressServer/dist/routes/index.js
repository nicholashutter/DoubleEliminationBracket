"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jet_validator_1 = __importDefault(require("jet-validator"));
const Paths_1 = __importDefault(require("../common/Paths"));
const User_1 = __importDefault(require("../models/User"));
const UserRoutes_1 = __importDefault(require("./UserRoutes"));
const apiRouter = (0, express_1.Router)(), validate = (0, jet_validator_1.default)();
const userRouter = (0, express_1.Router)();
userRouter.get(Paths_1.default.Users.Get, UserRoutes_1.default.getAll);
userRouter.post(Paths_1.default.Users.Add, validate(['user', User_1.default.isUser]), UserRoutes_1.default.add);
userRouter.put(Paths_1.default.Users.Update, validate(['user', User_1.default.isUser]), UserRoutes_1.default.update);
userRouter.delete(Paths_1.default.Users.Delete, validate(['id', 'number', 'params']), UserRoutes_1.default.delete);
apiRouter.use(Paths_1.default.Users.Base, userRouter);
exports.default = apiRouter;
