import axios from "axios";
import express, { Application, Request, Response } from "express";
import Vehicle from "./model/vehicle";
import cors from "cors";
const app: Application = express();

app.use(express.json());
app.use(cors());
// (() => {
//   try {
//     setInterval(async () => {
//       const data = await axios.get(
//         "https://api.metro.net/agencies/lametro/vehicles/"
//       );
//       const items = data.data.items;
//       const [{ latitude, longitude }] = items.filter(
//         (item: { id: string }) => item.id === "9556"
//       );
//       await Vehicle.create({
//         latitude: latitude + Math.random() * 10,
//         longitude: longitude + Math.random() * 10,
//       });
//     }, 1000);
//   } catch (err) {
//     console.error(err.message);
//   }
// })();
app.get("/", async (req: Request, res: Response) => {
  const users = await Vehicle.findAll();
  res.json(users);
  console.log(users);
});
app.listen(5000, "localhost", () => console.log(`http://localhost:5000`));
