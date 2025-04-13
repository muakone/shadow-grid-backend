import express from "express";
import { HomeInput, HomeResult } from "../types/Home";
import { fetchIrradianceFromPVGIS } from "../utils/pvgis";
import { getOrientationFactor } from "../utils/sunCalc";

const simulateRouter = express.Router();

simulateRouter.post("/", async (req, res) => {
  const homes = req.body as Omit<HomeInput, "panelSize">[];

  if (!homes || homes.length === 0) {
    return res.status(400).json({ error: "No homes provided." });
  }

  const avgLat = homes.reduce((sum, h) => sum + h.latlng.lat, 0) / homes.length;
  const avgLng = homes.reduce((sum, h) => sum + h.latlng.lng, 0) / homes.length;

  let irradiance: number;
  try {
    irradiance = await fetchIrradianceFromPVGIS(avgLat, avgLng);
  } catch (err) {
    console.error("Failed to fetch irradiance, using fallback:", err);
    irradiance = 5.5;
  }

  const totalDemand = homes.reduce((sum, h) => sum + h.dailyConsumption, 0);

  const solarHubs = homes
    .filter((h) => h.orientation === "South")
    .sort((a, b) => b.dailyConsumption - a.dailyConsumption)
    .slice(0, 2);

  const fixedPanelSize = 5.0;

  const homesWithPanels: HomeInput[] = homes.map((h) => {
    const isHub = solarHubs.find((hub) => hub.name === h.name);
    return {
      ...h,
      panelSize: isHub ? fixedPanelSize : 0,
    };
  });

  const totalProduction = homesWithPanels.reduce((sum, h) => {
    const factor = getOrientationFactor(h.orientation);
    return sum + (h.panelSize ?? 0) * irradiance * factor;
  }, 0);

  const usableProduction = totalProduction * 1.1;

  const results: HomeResult[] = homesWithPanels.map((home) => {
    const shareRatio = home.dailyConsumption / totalDemand;
    const received = usableProduction * shareRatio;
    const net = received - home.dailyConsumption;
    const isHub = solarHubs.find((h) => h.name === home.name);

    return {
      ...home,
      production: parseFloat(received.toFixed(2)),
      netEnergy: parseFloat(net.toFixed(2)),
      role: received >= home.dailyConsumption ? "served" : "under-supplied",
      isSolarHub: Boolean(isHub),
    };
  });

  res.json(results);
});

export default simulateRouter;
