"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const INVALID_CONSTRUCTOR_PARAM = 'nameOrObj arg must a string or an object ' +
    'with the appropriate user keys.';
function new_(name, email, created, id) {
    return {
        id: (id !== null && id !== void 0 ? id : -1),
        name: (name !== null && name !== void 0 ? name : ''),
        email: (email !== null && email !== void 0 ? email : ''),
        created: (created ? new Date(created) : new Date()),
    };
}
function from(param) {
    if (!isUser(param)) {
        throw new Error(INVALID_CONSTRUCTOR_PARAM);
    }
    const p = param;
    return new_(p.name, p.email, p.created, p.id);
}
function isUser(arg) {
    return (!!arg &&
        typeof arg === 'object' &&
        'id' in arg && typeof arg.id === 'number' &&
        'email' in arg && typeof arg.email === 'string' &&
        'name' in arg && typeof arg.name === 'string' &&
        'created' in arg && (0, moment_1.default)(arg.created).isValid());
}
exports.default = {
    new: new_,
    from,
    isUser,
};
