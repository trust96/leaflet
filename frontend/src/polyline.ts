import axios from "axios";
import { json, select } from "d3";
import { geoTransform } from "d3-geo";
import { polyline } from "leaflet";
import { Data } from "./Data";
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

    const time = dayLocations.data.map(({ dateTime }: { dateTime: string }) =>
      new Date(dateTime).getSeconds()
    );
    console.log(time);
    const myPolyline = polyline(dayLocation);

    //@ts-ignore
    const slider = sliderBottom().min(0).max(10).step(1).width(300);

    const g = select("#slider")
      .append("svg")
      .attr("width", 500)
      .attr("height", 100)
      .append("g")
      .attr("transform", "translate(30,30)");

    g.call(slider);
  } catch (err) {
    console.error(err.message);
  }
};

export default mypolyline;
