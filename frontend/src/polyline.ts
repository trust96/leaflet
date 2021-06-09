import axios from "axios";
import { geoPath, json, scaleLinear, select } from "d3";
import { geoTransform } from "d3-geo";
import { sliderBottom } from "d3-simple-slider";
import { LatLng, polyline } from "leaflet";
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
    dayLocation;
    const myPolyline = polyline(dayLocation);
    myPolyline.addTo(myMap);
    const geoPolyline = myPolyline.toGeoJSON();
    const svg = select(myMap.getPanes().overlayPane).append("svg");

    // if you don't include the leaflet-zoom-hide when a
    // user zooms in or out you will still see the phantom
    // original SVG
    const g = svg.append("g").attr("class", "leaflet-zoom-hide");

    ((collection) => {
      // this is not needed right now, but for future we may need
      // to implement some filtering. This uses the d3 filter function
      // featuresdata is an array of point objects

      //   const featuresdata = collection.filter(function(d) {
      //     return d.properties.id == "route1"
      // })
      console.log(collection);
      const transform = geoTransform({
        point: function (x, y) {
          const point = myMap.latLngToLayerPoint(new LatLng(y, x));
          this.stream.point(point.x, point.y);
        },
      });

      const d3path = geoPath().projection(transform);
    })(geoPolyline);
  } catch (err) {
    console.error(err.message);
  }
};

export default mypolyline;
