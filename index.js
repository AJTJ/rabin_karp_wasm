// Import our outputted wasm ES6 module
// Which, export default's, an initialization function
// import init from "./pkg/rabin_karp_wasm.js";

console.log("testing js");

// FOR TARGET WEB
// import init, { find_matches } from "./pkg/rabin_karp_wasm.js";
// const runWasm = async () => {
//   await init("./pkg/rabin_karp_wasm_bg.wasm");
//   const matchResult = find_matches("ddd", "dddddddda̐éö̲bbddddd");
//   console.log("IN WEB", { matchResult });
//   document.body.textContent = `matchResult: ${matchResult}`;
// };
// runWasm();

// FOR TARGET NODE
const { find_matches } = require("./pkg/rabin_karp_wasm");
const matchResult = find_matches("ddd", "ddddddddbbddddd");
console.log("IN NODE", { matchResult });
