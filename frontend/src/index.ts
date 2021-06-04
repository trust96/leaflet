import "./style.scss";
import { map, marker, tileLayer, polygon, geoJSON } from "leaflet";
//@ts-ignore
//@ts-ignore
import logo from "./assets/logo.png";
import axios from "axios";
import { Data } from "./Data";
//@ts-ignore
import simplePolygon from "simplepolygon";
import { iconSelector } from "./iconSelector";
const logoImage = document.querySelector(".logo") as HTMLImageElement;
logoImage.src = logo;

const myMap = map("map").setView([0, 0], 2);
tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);
// scraper icon

(async () => {
  const datas = await axios.get(
    "https://api.metro.net/agencies/lametro/vehicles/"
  );

  const data = datas.data.items;
  console.log(data);

  const locations = data
    .filter((position: Data) => position.heading === 90)
    .map(({ latitude, longitude }: Data) => {
      return [latitude, longitude];
    })
    .sort() as [number, number][];

  locations.forEach((item) =>
    marker([item[0], item[1]], { icon: iconSelector() })
      .bindPopup(
        `        <table class="table">
      <thead>
          <tr>
            <th class="col" >Mezzo</th>
            <th class="col" >telaio</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${item[0]}</td>
            <td>${item[1]}</td>
          </tr>

        </tbody>
  </table>`
      )
      .addTo(myMap)
  );

  const myPolygon = polygon(locations).addTo(myMap);
  myPolygon.redraw();

  myMap.setView(myPolygon.getCenter());
  myMap.fitBounds(myPolygon.getBounds());
})();
