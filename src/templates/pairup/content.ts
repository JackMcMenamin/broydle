import type { PairUpTask } from "./types";

export const pairUp1: PairUpTask = {
  type: "pairup",
  series: "Pair Up",
  edition: 1,
  title: "Director's Cut",
  blurb: "Match each film to its director.",
  leftLabel: "Film",
  verb: "directed by",
  rightLabel: "Director",
  pairs: [
    { left: "Jaws", right: "Steven Spielberg" },
    { left: "Pulp Fiction", right: "Quentin Tarantino" },
    { left: "Inception", right: "Christopher Nolan" },
    { left: "Get Out", right: "Jordan Peele" },
    { left: "Parasite", right: "Bong Joon-ho" },
    { left: "Titanic", right: "James Cameron" },
    { left: "Barbie", right: "Greta Gerwig" },
    { left: "The Shining", right: "Stanley Kubrick" },
  ],
};

export const pairUp2: PairUpTask = {
  type: "pairup",
  series: "Pair Up",
  edition: 2,
  title: "Baby Talk",
  blurb: "Match each animal to the name for its young.",
  leftLabel: "Animal",
  verb: "has a",
  rightLabel: "Baby",
  pairs: [
    { left: "Kangaroo", right: "Joey" },
    { left: "Swan", right: "Cygnet" },
    { left: "Goat", right: "Kid" },
    { left: "Owl", right: "Owlet" },
    { left: "Eel", right: "Elver" },
    { left: "Hare", right: "Leveret" },
    { left: "Whale", right: "Calf" },
    { left: "Pigeon", right: "Squab" },
  ],
};
