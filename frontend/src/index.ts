import "./style.scss";
import {
  map,
  marker,
  tileLayer,
  polygon,
  geoJSON,
  polyline,
  Marker,
  Polyline,
} from "leaflet";
//@ts-ignore
import logo from "./assets/logo.png";
import "leaflet.polyline.snakeanim";
import axios from "axios";
import { Data } from "./Data";

import { iconSelector } from "./iconSelector";
import area from "@turf/area";
//import mypolyline from "./polyline";
import { json, scaleLinear, select } from "d3";
import { sliderBottom } from "d3-simple-slider";
import { create } from "nouislider";
import wNumb from "wnumb";
import "leaflet.animatedmarker/src/AnimatedMarker";
import { LineString, MultiLineString } from "geojson";
const logoImage = document.querySelector(".logo") as HTMLImageElement;
const areaPolygonPara = document.querySelector(".area") as HTMLParagraphElement;

logoImage.src = logo;
const myButton = document.querySelector(".mybutton") as HTMLButtonElement;
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
})();

//mypolyline();
const range = document.querySelector("#slider");

//@ts-ignore
create(range, {
  range: {
    min: 0,
    max: 23.6,
  },

  step: 1,

  // Handles start at ...
  start: [1, 12],

  // Display colored bars between handles
  connect: true,

  // Put '0' at the bottom of the slider
  direction: "ltr",
  orientation: "horizontal",
  animate: true,

  // Move handle on tap, bars are draggable
  behaviour: "tap-drag",
  tooltips: true,
  format: wNumb({
    decimals: 2,
    mark: ":",
  }),

  // Show a scale with the slider
  pips: {
    mode: "steps",
    stepped: true,
    density: 4,
  },
});

let myPolyline: Polyline<LineString | MultiLineString, any>;
// //@ts-ignore
// range.noUiSlider.on("start", async () => {
//   try {
//     //@ts-ignore
//     const rangeNumber = range.noUiSlider.get().map((item: string) => {
//       const temp = item.split(":")[0];

//       return temp;
//     });
//     let dayLocations = await axios.get("http://localhost:5000");
//     let dayLocation = dayLocations.data
//       .filter(
//         (item: { id: string }) =>
//           item.id >= rangeNumber[0] && item.id <= rangeNumber[1]
//       )
//       .map(
//         ({ latitude, longitude }: { latitude: number; longitude: number }) => [
//           latitude,
//           longitude,
//         ]
//       );

//     if (myPolyline) {
//       myPolyline.remove();
//     }
//     myPolyline = polyline(dayLocation).addTo(myMap);

//     //@ts-ignore
//     const animatedMarker: any = L.animatedMarker(myPolyline.getLatLngs(), {
//       icon: iconSelector("scraper"),

//       onEnd: function () {
//         animatedMarker.remove();
//       },
//       autoStart: false,
//     });

//     myMap.addLayer(animatedMarker);
//     myButton.addEventListener("click", () => animatedMarker.start());
//   } catch (err) {
//     console.error(err.message);
//   }
// });

myButton.addEventListener("click", async () => {
  try {
    //@ts-ignore
    const rangeNumber = range.noUiSlider.get().map((item: string) => {
      const temp = item.split(":")[0];

      return temp;
    });
    let dayLocations = await axios.get("http://localhost:5000");
    let dayLocation = dayLocations.data
      .filter(
        (item: { id: string }) =>
          item.id >= rangeNumber[0] && item.id <= rangeNumber[1]
      )
      .map(
        ({ latitude, longitude }: { latitude: number; longitude: number }) => [
          latitude,
          longitude,
        ]
      );

    if (myPolyline) {
      myPolyline.remove();
    }
    myPolyline = polyline(dayLocation).addTo(myMap);

    //@ts-ignore
    const animatedMarker: any = L.animatedMarker(myPolyline.getLatLngs(), {
      icon: iconSelector("scraper"),

      onEnd: function () {
        animatedMarker.remove();
      },
      autoStart: false,
    });

    myMap.addLayer(animatedMarker);
    animatedMarker.start();
  } catch (err) {
    console.error(err.message);
  }
});
