import express from "express";
import { HomeResult } from "../types/Home";

const recommendationsRouter = express.Router();

recommendationsRouter.post("/", (req, res) => {
  const homes: HomeResult[] = req.body;

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

export default recommendationsRouter;
