import axios from "axios";
import { geoPath, json, scaleLinear, select } from "d3";
import { geoTransform } from "d3-geo";
import { sliderBottom } from "d3-simple-slider";
import { LatLng, polyline } from "leaflet";
import { Data } from "./Data";
import { myMap } from "./index";

// const mypolyline = async () => {
//   try {
//     const dayLocations = await axios.get("http://localhost:5000");
//     const dayLocation = dayLocations.data
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
//     const myPolyline = polyline(dayLocation);
//     myPolyline.addTo(myMap);
//   } catch (err) {
//     console.error(err.message);
//   }
// };

// export default mypolyline;
