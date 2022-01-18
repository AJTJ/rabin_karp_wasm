A rust implementation of the rabin-karp rolling hash algorithm for sub-string searching
repo: https://github.com/AJTJ/rabin_karp_wasm

usage:
```js
import { find_matches } from "rabin-karp-wasm";

// it will return an array of indices where substring matches begin
let result = find_matches(STRING_PATTERN_TO_SEARCH_FOR, STRING_TO_SEARCH_WITHIN);
```


TODO:
- Building out support for multi-character graphemes. Currently only supports single-character graphemes, i.e. the english alphabet.

The wasm-pack wrapper around the rabin-karp algorithm I wrote here:
https://github.com/AJTJ/rabin_karp