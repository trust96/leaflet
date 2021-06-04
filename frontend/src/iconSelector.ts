import { icon } from "leaflet";
//@ts-ignore
import ruspa from "./assets/ruspa.png";

export const iconSelector = (iconType?: string) => {
  switch (iconType) {
    case "scraper":
      return icon({
        iconUrl: ruspa,
        iconSize: [71, 44.51],
      });

    default:
      return icon({
        iconUrl: "../node_modules/leaflet/dist/images/marker-icon.png",
      });
  }
};
