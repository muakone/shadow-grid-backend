import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import simulateRouter from "./routes/simulateRouter";
import recommendationsRouter from "./routes/recommendationsRouter";
import billingRouter from "./routes/billingRoute";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/simulate", simulateRouter);
app.use("/api/recommendations", recommendationsRouter);
app.use("/api/billing", billingRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
