import "./style.scss";
import { map, marker, tileLayer, polygon, geoJSON, polyline } from "leaflet";
//@ts-ignore
import logo from "./assets/logo.png";
import axios from "axios";
import { Data } from "./Data";

import { iconSelector } from "./iconSelector";
import area from "@turf/area";
import mypolyline from "./polyline";
import { json, scaleLinear, select } from "d3";
import { sliderBottom } from "d3-simple-slider";
const logoImage = document.querySelector(".logo") as HTMLImageElement;
const areaPolygonPara = document.querySelector(".area") as HTMLParagraphElement;

logoImage.src = logo;

export const myMap = map("map").setView([0, 0], 2);
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
  const locations = data

    //   .filter((position: Data) => position.heading === 90)

    .map(({ latitude, longitude }: Data) => {
      return [latitude, longitude];
    });
  // center y
  locations.sort((a: number[], b: number[]) => a[1] - b[1]);
  const cy = (locations[0][1] + locations[locations.length - 1][1]) / 2;
  // center x
  locations.sort((a: number[], b: number[]) => a[0] - b[0]);
  const cx = (locations[0][0] + locations[locations.length - 1][0]) / 2;
  const center = { x: cx, y: cy };

  // Pre calculate the angles as it will be slow in the sort
  // As the points are sorted from right to left the first point
  // is the rightmost

  // Starting angle used to reference other angles
  var startAng: number;
  locations.forEach((point: number[]) => {
    var ang = Math.atan2(point[1] - center.y, point[0] - center.x);
    if (!startAng) {
      startAng = ang;
    } else {
      if (ang < startAng) {
        // ensure that all points are clockwise of the start point
        ang += Math.PI * 2;
      }
    }
    point[2] = ang; // add the angle to the point
  });

  // Sort clockwise;
  locations.sort((a: number[], b: number[]) => a[2] - b[2]);

  locations.forEach((item: any[]) => {
    let iconType: string = "scraper";
    switch (iconType) {
      case "scraper":
        marker([item[0], item[1]], { icon: iconSelector("scraper") })
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
          .addTo(myMap);
    }
  });

  const myPolygon = polygon(locations).addTo(myMap);
  const geoPoly = myPolygon.toGeoJSON();

  //calculate the area of the polygon in square meters
  const myArea = Math.floor(area(geoPoly));
  areaPolygonPara.innerHTML = `<strong>Area</strong>: ${myArea} m<sup>2</sup>`;

  //set the view to the center of the polygon and zoom to its position
  myMap.setView(myPolygon.getCenter());
  myMap.fitBounds(myPolygon.getBounds(), { animate: true, duration: 250 });
  console.log(myMap.getPanes().overlayPane);
})();

mypolyline();
