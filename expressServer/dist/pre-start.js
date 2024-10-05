import path from "path";
import dotenv from "dotenv";
import { parse } from "ts-command-line-args";
const args = parse({
    env: {
        type: String,
        defaultValue: "development",
        alias: "e",
    },
});
const result2 = dotenv.config({
    path: path.join(__dirname, `../env/${args.env}.env`),
});
if (result2.error) {
    throw result2.error;
}
//# sourceMappingURL=pre-start.js.map