import "reflect-metadata";
import express, { Application, Request, Response } from "express";
import { Vehicle } from "./entity/vehicle";
import cors from "cors";
import { Data } from "./Data";
import axios from "axios";
import { createConnection, getRepository } from "typeorm";
const app: Application = express();

app.use(express.json());
app.use(cors());
(async () => {
  try {
    await createConnection();
  } catch (error) {
    console.error(error.message);
  }
})();

(() => {
  setInterval(async () => {
    try {
      const data = await axios.get(
        "https://api.metro.net/agencies/lametro/vehicles/"
      );
      const items: Data[] = data.data.items;

      const locations = items
        .filter((item) => item.heading <= 18)
        .map(({ latitude, longitude, heading }: Data) => [
          latitude,
          longitude,
          heading,
        ]);
      locations.forEach(async ([latitude, longitude, heading]) => {
        try {
          const time = new Date();
          const vehiclesRepo = getRepository(Vehicle);
          const vehicle = vehiclesRepo.create({
            latitude: latitude * Math.random(),
            longitude: longitude * Math.random(),
            dateTime: time.getHours() + 1,
          });
          await vehiclesRepo.save(vehicle);
        } catch (err) {
          console.error(err.message);
        }
      });
    } catch (err) {
      console.error(err.message);
    }
  }, 1000);
})();
app.get("/", async (req: Request, res: Response) => {
  try {
    const vehiclesRepo = getRepository(Vehicle);
    const vehicles = await vehiclesRepo.findOne(1);
    return res.json(vehicles);
  } catch (err) {
    console.error(err.message);
  }
});
app.listen(5000, "localhost", () => console.log(`http://localhost:5000`));
