import type { PinDropTask } from "./types";

export const pinDropLandmarks: PinDropTask = {
  type: "pindrop",
  series: "Pin Drop",
  edition: 1,
  theme: "Landmarks",
  title: "Landmarks",
  blurb: "Drop a pin on each landmark. Within 600 km counts.",
  tolerance: 600,
  places: [
    { name: "Machu Picchu", lat: -13.1631, lng: -72.545 },
    { name: "Petra", lat: 30.3285, lng: 35.4444 },
    { name: "Angkor Wat", lat: 13.4125, lng: 103.867 },
    { name: "Uluru", lat: -25.3444, lng: 131.0369 },
    { name: "Neuschwanstein Castle", lat: 47.5576, lng: 10.7498 },
  ],
};

export const pinDropNature: PinDropTask = {
  type: "pindrop",
  series: "Pin Drop",
  edition: 2,
  theme: "Natural wonders",
  title: "Natural Wonders",
  blurb: "Drop a pin on each natural wonder. Within 600 km counts.",
  tolerance: 600,
  places: [
    { name: "Grand Canyon", lat: 36.1069, lng: -112.1129 },
    { name: "Victoria Falls", lat: -17.9243, lng: 25.8572 },
    { name: "Mount Fuji", lat: 35.3606, lng: 138.7274 },
    { name: "Iguazu Falls", lat: -25.6953, lng: -54.4367 },
    { name: "Ha Long Bay", lat: 20.9101, lng: 107.1839 },
  ],
};
