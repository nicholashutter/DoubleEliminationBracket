"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.IUser = void 0;
class IUser {
    constructor(id, username, email, passwordHash, createdAt, updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.passwordHash = "";
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
}
exports.IUser = IUser;
class User extends IUser {
    constructor(username, passwordHash, email) {
        const getRandomInt = (max) => {
            return Math.floor(Math.random() * max);
        };
        super(getRandomInt(10000), username, email, passwordHash, new Date(), new Date());
    }
    getUserID() {
        return this.id;
    }
    getUserName() {
        return this.username;
    }
    ;
    getEmail() {
        return this.email;
    }
    ;
    getLastUpdate() {
        return this.updatedAt;
    }
    ;
    getCreatedAt() {
        return this.updatedAt;
    }
    ;
    setLastUpdate(Date) {
        this.updatedAt = Date;
    }
    ;
    setUserName(username) {
        this.username = username;
    }
    ;
    setEmail(email) {
        this.email = email;
    }
    ;
    setPasswordHash(passwordHash) {
        this.passwordHash = passwordHash;
    }
    ;
    getPasswordHash() {
        return this.passwordHash;
    }
}
exports.User = User;
