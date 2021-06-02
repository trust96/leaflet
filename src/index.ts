import "./style.scss";
import {
  featureGroup,
  icon,
  map,
  Marker,
  marker,
  polygon,
  polyline,
  tileLayer,
} from "leaflet";
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
const group = featureGroup([]).addTo(myMap);

let myMarkers: Marker[] = [];
(() =>
  setInterval(async () => {
    const datas = await axios.get(
      "https://api.metro.net/agencies/lametro/vehicles/"
    );
    const data: Data[] = datas.data.items;
    const theArray = data
      // .filter((position) => position.heading === 1 || position.heading === 2)
      .map(({ latitude, longitude }) => {
        return [latitude, longitude];
      }) as [number, number][];
    theArray.forEach((item, index, array) => {
      myMarkers[index] = marker([item[0], item[1]], { icon: myIcon });

      group.addLayer(myMarkers[index]);
    });

    const myPolygon = polygon(theArray.sort());
    group.addLayer(myPolygon);
  }, 1000))();
