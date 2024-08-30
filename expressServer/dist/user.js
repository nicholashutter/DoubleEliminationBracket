"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _a, _UserManager_instance;
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(username, passwordHash, email, id) {
        if (id) {
            this.id = Math.floor(Math.random() * 1000);
        }
        else {
            this.id = id;
        }
        this.userName = username;
        this.passwordHash = passwordHash;
        this.email = email;
        this.created = new Date();
        this.lastUpdate = new Date();
        this.eliminations = 0;
        this.inGame = false;
        this.round = 0;
        this.currentRank = -1;
        this.allTimeWins = -1;
        this.allTimeLosses = -1;
        this.datesPlayed = [];
        this.totalGamesPlayed = -1;
    }
    get getUserID() {
        return this.id;
    }
    set setUserID(userID) {
        if (this.id === undefined) {
            this.id = userID;
        }
        else {
            console.log("Unable to update UserID because one already exists. This should not be possible. Err 016");
        }
    }
    get getUserName() {
        return this.userName;
    }
    set setUserName(userName) {
        this.userName = userName;
    }
    get getEmail() {
        return this.email;
    }
    set setEmail(email) {
        try {
            if (!email.includes("@") || !email.includes(".")) {
                this.email = email;
            }
            else {
                throw new Error("Email format incompatible. Please resubmit. Err 017");
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    get getLastUpdate() {
        return this.lastUpdate;
    }
    set setLastUpdate(lastUpdate) {
        this.lastUpdate = lastUpdate;
    }
    set setEliminations(eliminations) {
        this.eliminations = eliminations;
    }
    get getEliminations() {
        return this.eliminations;
    }
    get getCreated() {
        return this.created;
    }
    set setCreated(created) {
        this.created = created;
    }
    get getCurrentRank() {
        return this.currentRank;
    }
    set setCurrentRank(currentRank) {
        this.currentRank = currentRank;
    }
    get getAllTimeWins() {
        return this.allTimeWins;
    }
    set setAllTimeWins(allTimeWins) {
        this.allTimeWins = allTimeWins;
    }
    get getAllTimeLosses() {
        return this.allTimeLosses;
    }
    set setAllTimeLosses(allTimeLosses) {
        this.allTimeLosses = allTimeLosses;
    }
    get getPasswordHash() {
        return this.passwordHash;
    }
    get getInGame() {
        return this.inGame;
    }
    set setInGame(inGame) {
        this.inGame = inGame;
    }
    get getRound() {
        return this.round;
    }
    set setRound(round) {
        this.round = round;
    }
    set setGamesPlayed(totalGamesPlayed) {
        this.totalGamesPlayed = totalGamesPlayed;
    }
    get getGamesPlayed() {
        return this.totalGamesPlayed;
    }
    set setDatesPlayed(datesPlayed) {
        this.datesPlayed = datesPlayed;
    }
    get getDatesPlayed() {
        return this.datesPlayed;
    }
}
exports.User = User;
class UserManager extends User {
    constructor() {
        super();
        this.Users = [];
    }
    static get getInstance() {
        if (!__classPrivateFieldGet(_a, _a, "f", _UserManager_instance)) {
            __classPrivateFieldSet(_a, _a, new _a(), "f", _UserManager_instance);
        }
        return __classPrivateFieldGet(_a, _a, "f", _UserManager_instance);
    }
    createUser(username, passwordHash, email, id) {
        const user = new User(username, passwordHash, email, id);
        this.Users.push(user);
        return user.getUserID;
    }
    updateUser(currentUser) {
        try {
            const foundUser = this.Users.find((user) => user.getUserID == currentUser.getUserID);
            const userLocation = this.Users.indexOf(currentUser);
            if (foundUser.getUserName == "-1" || foundUser === undefined) {
                throw new Error("Unable to find specified User. Err 009");
            }
            else {
                delete this.Users[userLocation];
                this.Users[userLocation] = currentUser;
                console.log("User Updated Successfully");
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    replaceUser(username, passwordHash, email, id, inGame, currentRank, allTimeWins, allTimeLosses, totalGamesPlayed, datesPlayed, lastUpdate, created) {
        const user = new User(username, passwordHash, email);
        if (id) {
            user.setUserID = id;
        }
        if (inGame) {
            user.setInGame = inGame;
        }
        if (currentRank) {
            user.setCurrentRank = currentRank;
        }
        if (allTimeWins) {
            user.setAllTimeWins = allTimeWins;
        }
        if (allTimeLosses) {
            user.setAllTimeLosses = allTimeLosses;
        }
        if (totalGamesPlayed) {
            user.setGamesPlayed = totalGamesPlayed;
        }
        if (datesPlayed) {
            user.setDatesPlayed = datesPlayed;
        }
        if (lastUpdate) {
            user.setLastUpdate;
        }
        if (created) {
            user.setCreated = created;
        }
    }
    getUser(value) {
        let user = new User("-1", "-1", "-1");
        const getByUserName = (value) => {
            try {
                const foundUser = this.Users.find(user => user.getUserName === value);
                if (foundUser === undefined) {
                    throw new Error("User not found in Users collection. Err 013");
                }
                else {
                    user = foundUser;
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        const getByUserID = (value) => {
            try {
                const foundUser = this.Users.find(user => user.getUserID === value);
                if (foundUser === undefined) {
                    throw new Error("User not found in Users collection. Err 014");
                }
                else {
                    user = foundUser;
                }
            }
            catch (error) {
                console.log(error);
            }
        };
        if (typeof value === "string") {
            getByUserName(value);
        }
        else if (typeof value === "number") {
            getByUserID(value);
        }
        return user;
    }
    deleteUser(userID) {
        try {
            const foundUser = this.Users.find(user => user.getUserID === userID);
            if (foundUser === undefined) {
                throw new Error("User not found in Users collection. Err 015");
            }
            else {
                this.Users.splice(this.Users.findIndex(User => User.getUserID === userID), 1);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
_a = UserManager;
_UserManager_instance = { value: void 0 };
exports.default = UserManager;
