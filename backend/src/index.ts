import axios from "axios";
import express, { Application, Request, Response } from "express";
import { Vehicle } from "./model/vehicle";
import cors from "cors";
import { Data } from "./Data";
const app: Application = express();

app.use(express.json());
app.use(cors());
// (() => {
//   setInterval(async () => {
//     try {
//       const data = await axios.get(
//         "https://api.metro.net/agencies/lametro/vehicles/"
//       );
//       const items: Data[] = data.data.items;

//       const locations = items
//         .filter((item) => item.heading <= 18)
//         .map(({ latitude, longitude, heading }: Data) => [
//           latitude,
//           longitude,
//           heading,
//         ]);
//       locations.forEach(async ([latitude, longitude, heading]) => {
//         try {
//           await Vehicle.create({
//             latitude: latitude + Math.random(),
//             longitude: longitude + Math.random(),
//             heading,
//           });
//         } catch (err) {
//           console.error(err.message);
//         }
//       });
//     } catch (err) {
//       console.error(err.message);
//     }
//   }, 1000);
// })();
app.get("/", async (_req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.findAll();
    return res.json(vehicles);
  } catch (err) {
    console.error(err.message);
  }
});
app.listen(5000, "localhost", () => console.log(`http://localhost:5000`));
