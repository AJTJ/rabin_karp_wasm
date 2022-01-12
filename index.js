// Import our outputted wasm ES6 module
// Which, export default's, an initialization function
import init from "./pkg/rabin_karp_wasm.js";

const runWasm = async () => {
  // Instantiate our wasm module
  // const helloWorld = await init("./pkg/hello_world_bg.wasm");
  const initOutput = await init("./pkg/rabin_karp_wasm_bg.wasm");

  // Call the Add function export from wasm, save the result
  const matchResult = initOutput.find_matches("ddd", "aaadddda̐éö̲bbddddd");

  console.log({ matchResult });

  console.log("YOYOYO");

  // Set the result onto the body
  document.body.textContent = `Hello World! matchResult: ${matchResult}`;
};
runWasm();
