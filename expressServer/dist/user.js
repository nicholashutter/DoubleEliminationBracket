var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export class User {
    constructor() {
        this.id = -1;
        this.userName = "-1";
        this.passwordHash = "-1";
        this.email = "-1";
        this.created = new Date();
        this.lastUpdate = new Date();
        this.eliminations = -1;
        this.inGame = false;
        this.round = -1;
        this.currentRank = -1;
        this.allTimeWins = -1;
        this.allTimeLosses = -1;
        this.datesPlayed = [];
        this.totalGamesPlayed = -1;
    }
    init(username, passwordHash, email, id) {
        this.userName = username;
        this.passwordHash = passwordHash;
        this.email = email;
        this.round = 0;
        if (id !== undefined) {
            this.id = id;
        }
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
    get getEmail() {
        return this.email;
    }
    set setEmail(email) {
        try {
            if (email.includes("@") || email.includes(".")) {
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
class UserManager {
    constructor() {
        this.Users = [];
    }
    static get getInstance() {
        if (!__classPrivateFieldGet(_a, _a, "f", _UserManager_instance)) {
            __classPrivateFieldSet(_a, _a, new _a(), "f", _UserManager_instance);
        }
        return __classPrivateFieldGet(_a, _a, "f", _UserManager_instance);
    }
    createUser(username, passwordHash, email, id) {
        if (username == '') {
            throw new Error("username value required. Cannot proceed. Fatal. Err 227");
        }
        const localUser = new User();
        const generateUniqueID = (count) => {
            let randomID = Math.floor(Math.random() * 1000) + Date.now();
            this.Users.forEach(user => {
                if (user.getUserID == randomID) {
                    if (count > 1000) {
                        throw new Error("Collision Rate Higher than allowed: Err 100");
                    }
                    generateUniqueID(count + 1);
                }
            });
            return randomID;
        };
        if (id === undefined) {
            localUser.init(username, passwordHash, email, generateUniqueID(0));
            this.Users.push(localUser);
        }
        else {
            localUser.init(username, passwordHash, email, id);
            this.Users.push(localUser);
        }
        return localUser.getUserID;
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
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    getUser(value) {
        return __awaiter(this, void 0, void 0, function* () {
            let localUser = new User();
            if (typeof value === "string") {
                try {
                    const foundUser = this.Users.find(localUser => localUser.getUserName === value);
                    if (foundUser === undefined || foundUser.getUserID === undefined) {
                        throw new Error("User not found in Users collection. Err 013");
                    }
                    else if (foundUser.getUserID == -1 || foundUser.getUserName == "-1") {
                        throw new Error("Default user returned which implies user not found. Err 023");
                    }
                    else if (foundUser.getUserName == "" || String(foundUser.getUserID) == "") {
                        throw new Error("Default user returned which implies user not found. Err 022");
                    }
                    else {
                        localUser = foundUser;
                    }
                }
                catch (e) {
                    console.log(e);
                }
            }
            else if (typeof value === "number") {
                try {
                    const foundUser = this.Users.find(localUser => localUser.getUserID === value);
                    if (foundUser === undefined) {
                        throw new Error("User not found in Users collection. Err 014");
                    }
                    else if (foundUser.getUserName == "") {
                        throw new Error("Default user returned which implies user not found. Err 022");
                    }
                    else if (foundUser.getUserName == "-1") {
                        throw new Error("Default user returned which implies user not found. Err 023");
                    }
                    else if (foundUser.getUserID === undefined) {
                        throw new Error("Default user returned which implies user not found. Err 024");
                    }
                    else {
                        localUser = foundUser;
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            return localUser;
        });
    }
    deleteUser(userID) {
        try {
            const foundUser = this.Users.find(localUser => localUser.getUserID === userID);
            if (foundUser === undefined) {
                throw new Error("User not found in Users collection. Err 015");
            }
            else {
                this.Users.splice(this.Users.findIndex(localUser => localUser.getUserID === userID), 1);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    showAllUsers() {
        const showUsers = this.Users;
        return showUsers;
    }
    clearUsers() {
        this.Users = [];
    }
}
_a = UserManager;
_UserManager_instance = { value: void 0 };
export default UserManager;
