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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_1 = __importDefault(require("express"));
const entites_1 = require("../db/entites");
const signupInput_1 = require("../types/signupInput");
const dotenv_1 = __importDefault(require("dotenv"));
const authenticate_1 = require("../middleware/authenticate");
dotenv_1.default.config();
const router = express_1.default.Router();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send(yield entites_1.USER.find({}));
}));
router.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let parsedInput = signupInput_1.signupInput.safeParse(req.body);
    console.log(parsedInput);
    if (!parsedInput.success) {
        return res.status(403).json({ error: parsedInput.error });
    }
    if (parsedInput.success) {
        const { username, password } = parsedInput.data;
        const admin_username = process.env.USERNAME_ADMIN;
        const admin_password = process.env.PASSWORD_ADMIN;
        if (admin_username && admin_password) {
            if (admin_username === username && admin_password === password) {
                const user = new entites_1.USER({ username, password, role: "ADMIN" });
                yield user.save();
                return res.send("USER CREATED");
            }
        }
        const newUser = yield entites_1.USER.findOne({ username, password });
        if (newUser) {
            return res.status(403).json({ error: "USER ALREADY EXISTS" });
        }
        const user = new entites_1.USER({ username, password, role: "USER" });
        yield user.save();
        return res.send("USER CREATED");
    }
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let parsedInput = signupInput_1.signupInput.safeParse(req.body);
    console.log(parsedInput);
    if (!parsedInput.success) {
        return res.status(403).json({ message: "INVALID CREDENTIALS" });
    }
    if (parsedInput.success) {
        const { username, password } = parsedInput.data;
        const user = yield entites_1.USER.findOne({ username, password });
        if (user) {
            const secret = process.env.SECRET;
            if (secret) {
                const token = jsonwebtoken_1.default.sign({ id: user._id }, secret, { expiresIn: '1h' });
                return res.status(200).json({ message: "LOGIN SUCCESSFUL", token, role: user.role, username: user.username });
            }
            else
                return res.status(500).json({ message: "SERVER ERROR" });
        }
        else
            return res.status(403).json({ message: "USER DOESNT EXIST" });
    }
}));
router.post("/verifyJWT", authenticate_1.authenticateJwt, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.headers["userId"];
    const user = yield entites_1.USER.findOne({ _id: userId });
    if (user) {
        return res.status(200).json({ role: user.role, username: user.username });
    }
    else
        return res.status(403).json({ message: "COULDNT FIND USER" });
}));
exports.default = router;
