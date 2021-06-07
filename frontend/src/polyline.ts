import axios from "axios";
import { json, select } from "d3";
import { geoTransform } from "d3-geo";
import { polyline } from "leaflet";
import { myMap } from "./index";

const mypolyline = async () => {
  try {
    const dayLocations = await axios.get("http://localhost:5000");
    const dayLocation = dayLocations.data
      .filter((item: { heading: number }) => item.heading === 2)
      .map(
        ({ latitude, longitude }: { latitude: number; longitude: number }) => [
          latitude,
          longitude,
        ]
      );
    const svg = select(myMap.getPanes().overlayPane).append("svg");

    // if you don't include the leaflet-zoom-hide when a
    // user zooms in or out you will still see the phantom
    // original SVG
    const g = svg.append("g").attr("class", "leaflet-zoom-hide");
    const myPolyline = polyline(dayLocation);

    const myGeojson = myPolyline.toGeoJSON();
  } catch (err) {
    console.error(err.message);
  }
};

export default mypolyline;
