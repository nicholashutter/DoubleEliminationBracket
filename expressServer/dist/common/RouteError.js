"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RouteError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
exports.default = RouteError;
