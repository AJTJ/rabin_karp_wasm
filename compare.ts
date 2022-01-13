import { find_matches } from "./pkg/rabin_karp_wasm";
import { PerformanceObserver, performance } from "perf_hooks";

// run npx ts-node-dev --respawn compare.ts

let pattern = "kkk";
let text =
  "ioihekkkkkslllsshsdekksksslekkkkkksskskskskkksneblbkkkksskskkkkkioihekkkkkslllsshsdekksksslekkkkkksskskskskkksneblbkkkksskskkkkkioihekkkkkslllsshsdekksksslekkkkkksskskskskkksneblbkkkksskskkkkkioihekkkkkslllsshsdekksksslekkkkkksskskskskkksneblbkkkksskskkkkkioihekkkkkslllsshsdekksksslekkkkkksskskskskkksneblbkkkksskskkkkkioihekkkkkslllsshsdekksksslekkkkkksskskskskkksneblbkkkksskskkkkkioihekkkkkslllsshsdekksksslekkkkkksskskskskkksneblbkkkksskskkkkkioihekkkkkslllsshsdekksksslekkkkkksskskskskkksneblbkkkksskskkkkkioihekkkkkslllsshsdekksksslekkkkkksskskskskkksneblbkkkksskskkkkk";

// my node version doesn't include grapheme support yet, which will likely slow it down further
// let text = "dddddddda̐éö̲bbddddd";

function get_hash(pattern: string, b: number, prime: number) {
  const m = pattern.length;
  let hash = 0;
  for (let i = 0; i < m; i++) {
    const charCode = pattern.charCodeAt(i);
    hash = (hash * b + charCode) % prime;
  }

  return hash;
}

function roll_hash(
  previousHash: number,
  previousPattern: string,
  newPattern: string,
  prime: number
) {
  let newHash = previousHash;
  let multiplier = 1;
  for (let i = 1; i < previousPattern.length; i++) {
    multiplier *= 10;
    multiplier %= prime;
  }

  newHash += prime;
  newHash =
    (newHash - ((multiplier * previousPattern.charCodeAt(0)) % prime)) * 10;
  newHash += newPattern.charCodeAt(newPattern.length - 1);
  newHash %= prime;
  return newHash;
}

const find_matches_node = (pattern: string, text: string) => {
  let startI = 0;
  let endI = pattern.length - 1;
  let prime = 461;
  let patternHash = get_hash(pattern, 10, prime);

  let matches = [];
  let prevHash = null;
  while (endI <= text.length - 1) {
    let curHash = 0;
    let curSlice = text.slice(startI, endI + 1);
    if (prevHash === null) {
      curHash = get_hash(text.slice(0, endI + 1), 10, prime);
      prevHash = curHash;
    } else {
      curHash = roll_hash(
        prevHash,
        text.slice(startI - 1, endI),
        curSlice,
        prime
      );
      prevHash = curHash;
    }

    if (curHash === patternHash && pattern === curSlice) {
      matches.push(startI);
    }
    startI++;
    endI++;
  }

  return matches;
};

let a = performance.now();
let nodeResult = find_matches_node(pattern, text);
console.log("LOCAL", nodeResult);
let b = performance.now();
console.log("local performance: ", b - a);

let c = performance.now();
const matchResult = find_matches(pattern, text);
console.log("WASM", { matchResult });
let d = performance.now();
console.log("wasm performance: ", d - c);
