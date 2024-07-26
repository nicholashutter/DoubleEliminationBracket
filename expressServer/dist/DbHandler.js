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
const pool = mariadb_1.default.createPool({
    host: "localhost",
    user: "superuser",
    connectionLimit: 50,
});
class DbHandler {
    constructor(sqlQuery) {
        this.dbConnect(sqlQuery);
    }
    dbConnect(sqlQuery) {
        return __awaiter(this, void 0, void 0, function* () {
            let conn;
            try {
                conn = yield pool.getConnection();
                const res = yield conn.query(sqlQuery);
                console.log(res);
            }
            finally {
                if (conn)
                    conn.release();
            }
        });
    }
}
exports.default = DbHandler;
