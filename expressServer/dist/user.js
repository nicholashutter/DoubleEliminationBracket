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
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor(username, passwordHash, email) {
        this.id = 0;
        this.username = "";
        this.email = "";
        this.passwordHash = "";
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.getUserId = () => {
            return this.id;
        };
        this.getUserName = () => {
            return this.username;
        };
        this.getEmail = () => {
            return this.email;
        };
        this.getLastUpdate = () => {
            return this.updatedAt.toLocaleString();
        };
        this.getCreatedAt = () => {
            return this.updatedAt.toLocaleString();
        };
        this.setLastUpdate = (Date) => {
            this.updatedAt = Date;
        };
        this.setUserName = (username) => {
            this.username = username;
        };
        this.setEmail = (email) => {
            this.email = email;
        };
        this.setPasswordHash = (passwordHash) => {
            this.passwordHash = passwordHash;
        };
        const getRandomInt = (max) => {
            return Math.floor(Math.random() * max);
        };
        this.id = getRandomInt(10000);
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
class userWrapper {
    constructor(username, passwordHash, email) {
        this.getUserId = () => {
            return this.currentUser.getUserId();
        };
        this.getUserName = () => {
            return this.currentUser.getUserName();
        };
        this.setUsername = (username) => __awaiter(this, void 0, void 0, function* () {
            this.currentUser.setUserName(username);
        });
        this.getEmail = () => {
            return this.currentUser.getEmail();
        };
        this.setEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            if (email.includes("@") && email.includes(".")) {
                this.currentUser.setEmail(email);
            }
            else {
                throw new Error("user.ts: 90 email not in a valid format");
            }
        });
        this.setPasswordHash = (passwordHash) => __awaiter(this, void 0, void 0, function* () {
            this.currentUser.setPasswordHash(passwordHash);
        });
        this.setUpdatedAt = () => {
            this.currentUser.setLastUpdate(new Date());
        };
        this.getCreatedAt = () => {
            return this.currentUser.getCreatedAt();
        };
        this.getUpdatedAt = () => {
            return this.currentUser.getLastUpdate();
        };
        if (email.includes("@") && email.includes(".")) {
            this.currentUser = new User(username, passwordHash, email);
        }
        else if (username == null ||
            passwordHash == null ||
            email == null ||
            username === null ||
            passwordHash === null ||
            email === null ||
            username == undefined ||
            passwordHash == undefined ||
            email == undefined ||
            username === undefined ||
            passwordHash === undefined ||
            email === undefined) {
            throw new Error("user.ts 56 cannot create user safely some parameters are null or undefined");
        }
        else {
            throw new Error("user.ts: 59 email not in a valid format");
        }
    }
}
exports.default = userWrapper;
