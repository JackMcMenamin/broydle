import type { BallparkTask } from "./types";

export const ballpark1: BallparkTask = {
  type: "ballpark",
  series: "Ballpark",
  edition: 1,
  title: "Roughly Speaking",
  blurb: "Estimate each number. The tolerance is tight.",
  questions: [
    { q: "How tall is Mount Everest, in metres?", answer: 8849, min: 6000, max: 10000, step: 10, unit: "m", within: 250 },
    { q: "In what year was the first iPhone released?", answer: 2007, min: 2000, max: 2015, step: 1, within: 1, plain: true },
    { q: "How many keys are on a standard piano?", answer: 88, min: 60, max: 110, step: 1, unit: "keys", within: 3 },
    {
      q: "How far is the Moon from Earth on average, in thousands of km?",
      answer: 384,
      min: 200,
      max: 600,
      step: 1,
      unit: "thousand km",
      within: 25,
    },
    { q: "How many bones are in the adult human body?", answer: 206, min: 150, max: 300, step: 1, unit: "bones", within: 10 },
  ],
};

export const ballpark2: BallparkTask = {
  type: "ballpark",
  series: "Ballpark",
  edition: 2,
  title: "Roughly Speaking",
  blurb: "Estimate each number. The tolerance is tight.",
  questions: [
    { q: "In what year did the Berlin Wall fall?", answer: 1989, min: 1970, max: 2000, step: 1, within: 1, plain: true },
    { q: "How many member states does the European Union have?", answer: 27, min: 15, max: 40, step: 1, unit: "states", within: 1 },
    {
      q: "What is the top speed of a cheetah, in km/h?",
      answer: 110,
      min: 60,
      max: 150,
      step: 1,
      unit: "km/h",
      within: 10,
      note: "Estimates range from about 100 to 120 km/h.",
    },
    { q: "How long is a marathon, in km?", answer: 42.2, min: 30, max: 60, step: 0.1, unit: "km", within: 1.5 },
    { q: "How many elements are on the periodic table?", answer: 118, min: 90, max: 150, step: 1, unit: "elements", within: 3 },
  ],
};

const YEAR = { min: 1850, max: 2020, step: 1, within: 5, withinText: "5 years", plain: true };

export const datePhoto1: BallparkTask = {
  type: "ballpark",
  series: "Date the Photo",
  edition: 1,
  title: "When Was This?",
  blurb: "Slide to the year each photo was taken. Within 5 years counts.",
  questions: [
    { q: "The first powered flight.", answer: 1903, ...YEAR, image: "/photo/firstflight.jpg", credit: "John T. Daniels, public domain" },
    { q: "Construction of a very famous tower.", answer: 1888, ...YEAR, image: "/photo/eiffelconstruction.jpg", credit: "Public domain" },
    { q: "A migrant mother, photographed during a hard time.", answer: 1936, ...YEAR, image: "/photo/migrantmother.jpg", credit: "Dorothea Lange, public domain" },
    { q: "A man on the Moon.", answer: 1969, ...YEAR, image: "/photo/aldrin.jpg", credit: "NASA, public domain" },
    { q: "A crowd on top of a wall in Berlin.", answer: 1989, ...YEAR, image: "/photo/brandenburg1989.jpg", credit: "US Department of Defense, public domain" },
  ],
};

export const datePhoto2: BallparkTask = {
  type: "ballpark",
  series: "Date the Photo",
  edition: 2,
  title: "When Was This?",
  blurb: "Slide to the year each photo was taken. Within 5 years counts.",
  questions: [
    { q: "A US president, photographed in a studio.", answer: 1863, ...YEAR, image: "/photo/lincoln.jpg", credit: "Alexander Gardner, public domain" },
    { q: "An ocean liner leaving port.", answer: 1912, ...YEAR, image: "/photo/titanic.jpg", credit: "Public domain" },
    { q: "A crowd outside a stock exchange.", answer: 1929, ...YEAR, image: "/photo/nyse1929.jpg", credit: "Public domain" },
    { q: "A band arriving in America.", answer: 1964, ...YEAR, image: "/photo/beatles.jpg", credit: "United Press International, public domain" },
    { q: "The whole Earth, photographed from space.", answer: 1972, ...YEAR, image: "/photo/bluemarble.jpg", credit: "NASA, public domain" },
  ],
};
