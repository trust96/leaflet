import axios from "axios";
import express, { Application, Request, Response } from "express";
import Vehicle from "./model/vehicle";
import cors from "cors";
import { Data } from "./Data";
const app: Application = express();

app.use(express.json());
app.use(cors());
(() => {
  try {
    setInterval(async () => {
      const data = await axios.get(
        "https://api.metro.net/agencies/lametro/vehicles/"
      );
      const items: Data[] = data.data.items;
      const location = items.map((item) => {
        return [item.latitude, item.longitude];
      });
      location.forEach(async (loc) => {
        await Vehicle.create({
          latitude: loc[0] + Math.random(),
          longitude: loc[1] + Math.random(),
        });
      });
    }, 100);
  } catch (err) {
    console.error(err.message);
  }
})();
app.get("/", async (req: Request, res: Response) => {
  const users = await Vehicle.findAll();
  res.json(users);
  console.log(users);
});
app.listen(5000, "localhost", () => console.log(`http://localhost:5000`));
