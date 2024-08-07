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
const mariadb_1 = __importDefault(require("mariadb"));
const user_1 = require("./user");
const pool = mariadb_1.default.createPool({
    host: "localhost",
    user: "root",
    connectionLimit: 50,
});
class DbHandler {
    constructor() {
        this.db = "";
        this.user = new user_1.User("", "", "");
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = user;
            this.db = "use userdb";
            const query = "INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);";
            const params = [
                this.user.getUserID(),
                this.user.getUserName(),
                this.user.getEmail(),
                this.user.getPassword_Hash(),
                this.user.getCreatedAt(),
                this.user.getLastUpdate(),
            ];
            yield this.doQuery(query, params);
        });
    }
    joinSession(sessionID, user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = user;
            this.db = "use userdb";
            const query = "INSERT INTO sessions (sessionID, user_id) VALUES (?, ?)";
            const params = [
                sessionID,
                this.user.getUserID()
            ];
            yield this.doQuery(query, params);
        });
    }
    leaveSession(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = user;
            this.db = "use userdb";
            const query = "DELETE FROM sessions WHERE user_id = ?";
            const params = [
                this.user.getUserID()
            ];
            this.doQuery(query, params);
        });
    }
    readUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = user;
            this.db = "use userdb";
            const query = "SELECT * FROM users WHERE id = ? OR username = ? OR email = ?";
            const params = [
                this.user.getUserID(),
                this.user.getUserName(),
                this.user.getEmail(),
            ];
            const userObject = yield this.doQuery(query, params);
            let returnUser = new user_1.User("", "", "", -1);
            if (userObject !== undefined) {
                returnUser = new user_1.User(userObject.username, userObject.password_hash, userObject.email, userObject.id);
            }
            return returnUser;
        });
    }
    deleteUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = user;
            this.db = "use userdb";
            const query = "DELETE FROM users WHERE id = ? OR username = ? OR email = ?";
            const params = [
                this.user.getUserID(),
                this.user.getUserName(),
                this.user.getEmail(),
            ];
            this.doQuery(query, params);
        });
    }
    doQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.conn = yield pool.getConnection();
                let res = this.conn.query(this.db);
                res = yield this.conn.query(query, params);
                if (res.length > 0) {
                    return res[0];
                }
            }
            catch (e) {
                console.log(e);
            }
            finally {
                if (this.conn)
                    this.conn.release();
            }
        });
    }
}
exports.default = DbHandler;
