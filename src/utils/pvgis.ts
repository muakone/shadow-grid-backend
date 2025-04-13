import axios from "axios";

type PVGISRow = { [key: string]: number };

export const fetchIrradianceFromPVGIS = async (
  lat: number,
  lng: number
): Promise<number> => {
  const url = `https://re.jrc.ec.europa.eu/api/v5_2/series.json?lat=${lat}&lon=${lng}&startyear=2020&endyear=2020&outputformat=json&angle=30&aspect=0&pvtechchoice=crystSi&loss=14&peakpower=1`;



  try {
    const res = await axios.get(url);
    const data = res.data.outputs?.hourly;

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("No hourly data found");
    }

    const total = data.reduce((sum: number, h: PVGISRow) => sum + (h["G(i)"] || 0), 0);
    const avg = total / data.length;

    return parseFloat((avg * 24 / 1000).toFixed(2));
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error fetching irradiance data:", err.message);
    } else {
      console.error("Error fetching irradiance data:", err);
    }
    return 6.5;
  }
};
