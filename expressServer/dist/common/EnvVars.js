var _a, _b, _c, _d;
export default {
    NodeEnv: ((_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : ''),
    Port: ((_b = process.env.PORT) !== null && _b !== void 0 ? _b : 0),
    Jwt: {
        Secret: ((_c = process.env.JWT_SECRET) !== null && _c !== void 0 ? _c : ''),
        Exp: ((_d = process.env.COOKIE_EXP) !== null && _d !== void 0 ? _d : ''),
    },
};
