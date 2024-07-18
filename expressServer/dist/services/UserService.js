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
exports.USER_NOT_FOUND_ERR = void 0;
const RouteError_1 = __importDefault(require("../common/RouteError"));
const HttpStatusCodes_1 = __importDefault(require("../common/HttpStatusCodes"));
const UserRepo_1 = __importDefault(require("../repos/UserRepo"));
exports.USER_NOT_FOUND_ERR = 'User not found';
function getAll() {
    return UserRepo_1.default.getAll();
}
function addOne(user) {
    return UserRepo_1.default.add(user);
}
function updateOne(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const persists = yield UserRepo_1.default.persists(user.id);
        if (!persists) {
            throw new RouteError_1.default(HttpStatusCodes_1.default.NOT_FOUND, exports.USER_NOT_FOUND_ERR);
        }
        return UserRepo_1.default.update(user);
    });
}
function _delete(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const persists = yield UserRepo_1.default.persists(id);
        if (!persists) {
            throw new RouteError_1.default(HttpStatusCodes_1.default.NOT_FOUND, exports.USER_NOT_FOUND_ERR);
        }
        return UserRepo_1.default.delete(id);
    });
}
exports.default = {
    getAll,
    addOne,
    updateOne,
    delete: _delete,
};
