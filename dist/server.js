"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
app.get('/', (req, res) => {
    res.send("ANOTHER TEST");
});
app.get('/home', (req, res) => {
    res.send("HOME");
});
app.listen(5000, () => {
    console.log("Server is running");
});
//# sourceMappingURL=server.js.map