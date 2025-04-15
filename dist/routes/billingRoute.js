"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const billingRouter = express_1.default.Router();
billingRouter.post("/", (req, res) => {
    const { homes, filter } = req.body;
    if (!Array.isArray(homes)) {
        return res.status(400).json({ error: "Invalid homes data" });
    }
    const costPerKwh = 120; // ₦ per kilowatt-hour
    const multiplier = filter === "weekly" ? 7 : filter === "monthly" ? 30 : 1;
    const bills = homes.map((home) => ({
        name: home.name,
        dailyConsumption: home.dailyConsumption ?? 0,
        duration: filter,
        bill: parseFloat(((home.dailyConsumption ?? 0) * multiplier * costPerKwh).toFixed(2)),
    }));
    return res.json(bills);
});
exports.default = billingRouter;
