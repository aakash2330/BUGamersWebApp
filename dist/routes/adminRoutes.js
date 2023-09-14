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
const express_1 = __importDefault(require("express"));
const entites_1 = require("../db/entites");
const router = express_1.default.Router();
router.get('/', (req, res) => {
    console.log("event");
    res.send("ADMIN ROUTE");
});
router.post('/createEvent', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, imageUrl } = req.body;
    const newEvent = new entites_1.EVENT({ title, description, imageUrl });
    yield newEvent.save();
    res.send("EVENT CREATED");
}));
router.get('/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const eventList = yield entites_1.EVENT.find();
    res.send(eventList);
}));
exports.default = router;
