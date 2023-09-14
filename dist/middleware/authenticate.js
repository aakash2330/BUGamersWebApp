"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function authenticateJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];
        const secret = process.env.SECRET;
        console.log({ secret, token });
        if (secret) {
            jsonwebtoken_1.default.verify(token, secret, (err, payload) => {
                if (err) {
                    return res.status(403).json({ message: err });
                }
                if (!payload) {
                    return res.status(403).json({ message: "COULDNT VERIFY PAYLOAD" });
                }
                if (typeof payload === "string") {
                    return res.sendStatus(403);
                }
                req.headers["userId"] = payload.id;
                next();
            });
        }
        else
            return res.status(500).json({ message: "SERVER ERROR" });
    }
    else
        return res.status(403).json("AUTHORIZATION FAILED");
}
exports.authenticateJwt = authenticateJwt;
