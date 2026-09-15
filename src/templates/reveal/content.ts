import type { RevealTask } from "./types";

export const pixelReveal1: RevealTask = {
  type: "reveal",
  variant: "pixelate",
  series: "Pixel Reveal",
  edition: 1,
  title: "Blur Wars",
  blurb: "Five pixelated pictures. Name each one.",
  items: [
    {
      src: "/pixel/sagrada.jpg",
      answer: "Sagrada Família",
      aliases: ["sagrada familia", "la sagrada familia", "basilica de la sagrada familia", "sagrada"],
      hint: "Building in Spain",
      credit: "Bernard Gagnon, CC BY-SA 3.0, via Wikimedia Commons",
    },
    {
      src: "/pixel/moai.jpg",
      answer: "Moai",
      aliases: ["moai statues", "easter island heads", "easter island statues", "easter island", "moai statue"],
      hint: "Statues on an island",
      credit: "Rivi, CC BY-SA 3.0, via Wikimedia Commons",
    },
    {
      src: "/pixel/axolotl.jpg",
      answer: "Axolotl",
      aliases: ["axolotls", "axolotle", "axolotol", "mexican walking fish"],
      hint: "Amphibian",
      credit: "LoKiLeCh, CC BY-SA 3.0, via Wikimedia Commons",
    },
    {
      src: "/pixel/petra.jpg",
      answer: "Petra",
      aliases: ["petra jordan", "the treasury", "al khazneh", "treasury at petra"],
      hint: "Ancient city in Jordan",
      credit: "Berthold Werner, public domain, via Wikimedia Commons",
    },
    {
      src: "/pixel/gameboy.jpg",
      answer: "Game Boy",
      aliases: ["gameboy", "nintendo game boy", "nintendo gameboy", "original game boy"],
      hint: "Handheld from 1989",
      credit: "Evan-Amos, public domain, via Wikimedia Commons",
    },
  ],
};

export const zoomedIn1: RevealTask = {
  type: "reveal",
  variant: "zoom",
  series: "Zoomed In",
  edition: 1,
  title: "Too Close",
  blurb: "Five extreme close-ups. Name what you are looking at.",
  items: [
    {
      src: "/zoom/honeycomb.jpg",
      answer: "Honeycomb",
      aliases: ["honey comb", "beehive", "bee hive", "honeycombs", "bees wax", "beeswax"],
      hint: "Made by insects",
      focus: [0.55, 0.5],
      credit: "Waugsberg, CC BY-SA 3.0, via Wikimedia Commons",
    },
    {
      src: "/zoom/kiwi.jpg",
      answer: "Kiwi",
      aliases: ["kiwi fruit", "kiwifruit", "kiwis"],
      hint: "Fruit",
      focus: [0.5, 0.55],
      credit: "André Karwath, CC BY-SA 2.5, via Wikimedia Commons",
    },
    {
      src: "/zoom/vinyl.jpg",
      answer: "Vinyl record",
      aliases: ["vinyl", "record", "lp", "lp record", "a record", "vinyl lp"],
      hint: "Music format",
      focus: [0.5, 0.5],
      credit: "Evan-Amos, public domain, via Wikimedia Commons",
    },
    {
      src: "/zoom/lego.jpg",
      answer: "Lego",
      aliases: ["lego bricks", "lego brick", "legos", "lego blocks"],
      hint: "Toy",
      focus: [0.4, 0.5],
      credit: "Alan Chia, CC BY-SA 2.0, via Wikimedia Commons",
    },
    {
      src: "/pixel/giraffe.jpg",
      answer: "Giraffe",
      aliases: ["a giraffe", "giraffes", "giraffe skin", "giraffe pattern"],
      hint: "Animal",
      focus: [0.5, 0.35],
      credit: "Muhammad Mahdi Karim, GFDL 1.2, via Wikimedia Commons",
    },
  ],
};

export const flagFrag1: RevealTask = {
  type: "reveal",
  variant: "zoom",
  series: "Flag Frag",
  edition: 1,
  title: "Fragments",
  blurb: "A tiny piece of a flag. Name the country.",
  note: "Type the country (or nation) the flag belongs to.",
  how: "Five flags, each shown as a tiny fragment. Type the country. A wrong guess zooms out a step. Guess wrong on the widest stage and you lose a heart.",
  items: [
    { src: "/flags/mx.svg", answer: "Mexico", aliases: ["mexican"], hint: "North America", focus: [0.5, 0.5] },
    { src: "/flags/lk.svg", answer: "Sri Lanka", aliases: ["srilanka", "ceylon"], hint: "Asia", focus: [0.62, 0.5] },
    { src: "/flags/bt.svg", answer: "Bhutan", aliases: ["bhutanese"], hint: "Asia", focus: [0.5, 0.5] },
    { src: "/flags/ke.svg", answer: "Kenya", aliases: ["kenyan"], hint: "Africa", focus: [0.5, 0.5] },
    { src: "/flags/uy.svg", answer: "Uruguay", aliases: ["uruguayan"], hint: "South America", focus: [0.18, 0.28] },
  ],
};

export const shapeUp1: RevealTask = {
  type: "reveal",
  variant: "silhouette",
  series: "Shape Up",
  edition: 1,
  title: "Outlines",
  blurb: "Name the country from its outline alone.",
  note: "Outlines are shown without neighbours or islands, and not to scale.",
  items: [
    { country: "Vietnam", answer: "Vietnam", aliases: ["viet nam", "vietnamese"], hint: "Asia" },
    { country: "Portugal", answer: "Portugal", aliases: ["portugese", "portuguese"], hint: "Europe" },
    { country: "Cuba", answer: "Cuba", aliases: ["cuban"], hint: "Caribbean" },
    { country: "Turkey", answer: "Turkey", aliases: ["turkiye", "türkiye"], hint: "Europe / Asia" },
    { country: "Madagascar", answer: "Madagascar", aliases: ["madagasgar"], hint: "Africa" },
  ],
};
