import "./style.scss";
import {
  featureGroup,
  geoJSON,
  icon,
  map,
  Marker,
  marker,
  Polygon,
  polygon,
  polyline,
  Rectangle,
  tileLayer,
} from "leaflet";

import { polygon as turfPolygon, Position } from "@turf/helpers";
import axios from "axios";
const myMap = map("map").setView([51.505, -0.09], 2);
tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

interface Data {
  heading: number;
  id: string;
  latitude: number;
  longitude: number;
  predictable: boolean;
  route_id: string;
  run_id: string;
  seconds_since_report: number;
}

const myIcon = icon({
  iconUrl: "../node_modules/leaflet/dist/images/marker-icon.png",
});

(async () => {
  const datas = await axios.get(
    "https://api.metro.net/agencies/lametro/vehicles/"
  );
  const data = datas.data.items
    //  .filter((position: Data) => position.heading === 1)
    .map(({ latitude, longitude }: Data, index: number, array: Data[]) => {
      array.forEach((item) =>
        marker([latitude, longitude], { icon: myIcon }).addTo(myMap)
      );
      return [latitude, longitude];
    }) as [number, number][];

  const myPolygon = polygon(data)
    .addEventListener("add", () => {
      console.log("added");
    })
    .addTo(myMap);
})();
