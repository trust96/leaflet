import "./style.scss";
import { icon, map, marker, polygon, tileLayer } from "leaflet";
//@ts-ignore
import ruspa from "./assets/ruspa.png";
//@ts-ignore
import logo from "./assets/logo.png";
import axios from "axios";
import { Data } from "./Data";
import distance from "./distance";

const logoImage = document.querySelector(".logo") as HTMLImageElement;
logoImage.src = logo;

const myMap = map("map").setView([0, 0], 2);
tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(myMap);

// scraper icon
const scraperIcon = icon({
  iconUrl: ruspa,
  iconSize: [71, 44.51],
});

(async () => {
  const datas = await axios.get(
    "https://api.metro.net/agencies/lametro/vehicles/"
  );

  const data = datas.data.items;
  console.log(data);

  const locations = data
    //.filter((position: Data) => position.heading === 1)
    .map(({ latitude, longitude }: Data) => {
      return [latitude, longitude];
    })
    .sort() as [number, number][];

  data.forEach((item: Data) =>
    marker([item.latitude, item.longitude], { icon: scraperIcon })
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
            <td>${item.route_id}</td>
            <td>${item.heading}</td>
          </tr>

        </tbody>
  </table>`
      )
      .addTo(myMap)
  );
  const myPolygon = polygon(locations).addTo(myMap);
  myMap.setView(myPolygon.getCenter());
  myMap.fitBounds(myPolygon.getBounds());
})();
