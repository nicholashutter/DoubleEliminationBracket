"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRandomInt = getRandomInt;
exports.tick = tick;
function getRandomInt() {
    return Math.floor(Math.random() * 1000000000000);
}
function tick(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}
