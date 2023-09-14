"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EVENT = exports.USER = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: String,
    password: String,
    role: String,
});
const eventSchema = new mongoose_1.default.Schema({
    title: String,
    description: String,
    imageUrl: String
});
exports.USER = mongoose_1.default.model('user', userSchema);
exports.EVENT = mongoose_1.default.model('event', eventSchema);
