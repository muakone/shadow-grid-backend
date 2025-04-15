"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const recommendationsRouter = express_1.default.Router();
recommendationsRouter.post("/", (req, res) => {
    const homes = req.body;
    if (!homes || homes.length === 0) {
        return res.status(400).json({ error: "No homes provided" });
    }
    const hubs = homes.filter(h => h.isSolarHub);
    const recommendations = homes.map((home) => {
        const isHub = home.isSolarHub;
        return {
            from: isHub ? `${home.name} (self)` : hubs.map(h => h.name).join(" & "),
            to: home.name,
            allocated: parseFloat(home.production.toFixed(2)),
            demand: home.dailyConsumption,
            satisfied: home.production >= home.dailyConsumption
        };
    });
    console.log("Recommendations generated.");
    res.json(recommendations);
});
exports.default = recommendationsRouter;
