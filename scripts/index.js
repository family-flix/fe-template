const path = require("path");

const madge = require("madge");

const PROJECT_SRC = path.join(__dirname, "../src");
// const entry = path.resolve(PROJECT_SRC, "./index.tsx");
const entry = path.resolve(PROJECT_SRC, "./store/routes.ts");
const config = {
  fileExtensions: ["ts", "tsx", "js", "jsx", "index.ts", "index.tsx", "index.js", "index.jsx"],
};

madge(entry, config).then((res) => {
  console.log(res.obj());
});

// madge(entry)
//   .then((res) => res.svg())
//   .then((output) => {
//     console.log(output.toString());
//   });

// madge(entry).then((res) => {
//   console.log(res.orphans());
// });
// madge(entry).then((res) => {
//   console.log(res.circularGraph());
// });

// madge(entry)
//   .then((res) => res.svg())
//   .then((output) => {
//     console.log(output.toString());
//   });

// madge(entry)
//   .then((res) => res.dot())
//   .then((output) => {
//     console.log(output);
//   });

// madge(entry).then((res) => {
//   console.log(res.leaves());
// });
