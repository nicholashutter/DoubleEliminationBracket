"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.IUser = void 0;
class IUser {
    constructor(id, username, email, password_hash, createdAt, updatedAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password_hash = password_hash;
        this.createdAt = new Date();
        this.updatedAt = new Date();
        this.authenticated = false;
    }
}
exports.IUser = IUser;
class User extends IUser {
    constructor(username, password_hash, email, id) {
        const getRandomInt = (max) => {
            return Math.floor(Math.random() * max);
        };
        if (id === undefined) {
            super(getRandomInt(10000), username, email, password_hash, new Date(), new Date());
        }
        else {
            super(id, username, email, password_hash, new Date(), new Date());
        }
    }
    getUserID() {
        return this.id;
    }
    getUserName() {
        return this.username;
    }
    getEmail() {
        return this.email;
    }
    getLastUpdate() {
        return this.updatedAt;
    }
    getCreatedAt() {
        return this.updatedAt;
    }
    setCreatedAt(newCreatedAt) {
        this.updatedAt = newCreatedAt;
    }
    setLastUpdate(Date) {
        try {
            this.updatedAt = Date;
        }
        catch (_a) {
            console.log("user.setLastUpdate() failed");
        }
    }
    setUserName(username) {
        this.username = username;
    }
    setEmail(email) {
        try {
            if (!email.includes("@") || !email.includes(".")) {
                this.email = email;
            }
        }
        catch (_a) {
            console.log("user.setEmail() failed");
        }
    }
    setPassword_Hash(password_hash) {
        this.password_hash = password_hash;
    }
    getPassword_Hash() {
        return this.password_hash;
    }
    updateAuthenticated() {
        this.authenticated = this.authenticated ? true : false;
    }
}
exports.User = User;
