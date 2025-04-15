import express from "express";
import { HomeResult } from "../types/Home";

const billingRouter = express.Router();

billingRouter.post("/", (req, res) => {
  const { homes, filter } = req.body as {
    homes: HomeResult[];
    filter: "daily" | "weekly" | "monthly";
  };

  if (!Array.isArray(homes)) {
    return res.status(400).json({ error: "Invalid homes data" });
  }

  const costPerKwh = 120; // ₦ per kilowatt-hour
  const multiplier = filter === "weekly" ? 7 : filter === "monthly" ? 30 : 1;

  const bills = homes.map((home) => ({
    name: home.name,
    dailyConsumption: home.dailyConsumption ?? 0,
    duration: filter,
    bill: parseFloat(
      ((home.dailyConsumption ?? 0) * multiplier * costPerKwh).toFixed(2)
    ),
  }));

  return res.json(bills); 
});

export default billingRouter;
