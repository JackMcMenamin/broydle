import type { FillGapTask } from "./types";

export const fillGap1: FillGapTask = {
  type: "fillgap",
  series: "Fill the Gap",
  edition: 1,
  title: "One Missing",
  blurb: "Each set is missing one member. Fill the gap.",
  gaps: [
    { before: ["Do", "Re", "Mi"], after: ["Sol", "La", "Ti"], answer: "Fa" },
    { before: ["Mercury", "Venus", "Earth"], after: ["Jupiter"], answer: "Mars" },
    { before: ["John", "Paul"], after: ["Ringo"], answer: "George" },
    { before: ["Red", "Orange", "Yellow"], after: ["Blue", "Indigo", "Violet"], answer: "Green" },
    { before: ["Alvin", "Simon"], after: [], answer: "Theodore", note: "The Chipmunks." },
    { before: ["Bashful", "Doc", "Dopey", "Grumpy", "Happy", "Sleepy"], after: [], answer: "Sneezy", note: "The seven dwarfs." },
  ],
};

export const fillGap2: FillGapTask = {
  type: "fillgap",
  series: "Fill the Gap",
  edition: 2,
  title: "One Missing",
  blurb: "Each set is missing one member. Fill the gap.",
  gaps: [
    { before: ["Leonardo", "Donatello"], after: ["Michelangelo"], answer: "Raphael" },
    { before: ["Gryffindor", "Hufflepuff"], after: ["Slytherin"], answer: "Ravenclaw" },
    { before: ["Baby", "Scary", "Sporty"], after: ["Posh"], answer: "Ginger", note: "Spice Girls." },
    { before: ["Pacific", "Atlantic"], after: ["Southern", "Arctic"], answer: "Indian" },
    { before: ["Dasher", "Dancer", "Prancer", "Vixen", "Comet", "Cupid"], after: ["Blitzen"], answer: "Donner", aliases: ["donder", "dunder"], note: "Santa's reindeer." },
    { before: ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra"], after: ["Sagittarius", "Capricorn", "Aquarius", "Pisces"], answer: "Scorpio" },
  ],
};
