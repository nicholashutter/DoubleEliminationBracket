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
        this.query = "";
        this.params = [];
        this.user = new user_1.User("", "", "");
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = user;
            this.db = "use userdb";
            this.query =
                "INSERT INTO users (id, username, email, password_hash, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?);";
            this.params = [
                this.user.getUserID(),
                this.user.getUserName(),
                this.user.getEmail(),
                this.user.getPassword_Hash(),
                this.user.getCreatedAt(),
                this.user.getLastUpdate(),
            ];
            yield this.doQuery(this.query, this.params);
        });
    }
    readUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = user;
            this.db = "use userdb";
            this.query =
                "SELECT * FROM users WHERE id = ? OR username = ? OR email = ?";
            this.params = [
                this.user.getUserID(),
                this.user.getUserName(),
                this.user.getEmail()
            ];
            const res = yield this.doQuery(this.query, this.params);
            return res;
        });
    }
    deleteUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.user = user;
            this.db = "use userdb";
            this.query = "DELETE FROM users WHERE id = ? OR username = ? OR email = ?";
            this.params = [
                this.user.getUserID(),
                this.user.getUserName(),
                this.user.getEmail()
            ];
            this.doQuery(this.query, this.params);
        });
    }
    doQuery(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.conn = yield pool.getConnection();
                let res = this.conn.query(this.db);
                res = yield this.conn.query(this.query, this.params);
                return res[0];
            }
            finally {
                if (this.conn)
                    this.conn.release();
            }
        });
    }
}
exports.default = DbHandler;
