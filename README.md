A rust implementation of the rabin-karp rolling hash algorithm for sub-string searching
repo: https://github.com/AJTJ/rabin_karp_wasm

usage:
```js
import { find_matches } from "rabin-karp-wasm";

// it will return an array of indices where substring matches begin
let result = find_matches(STRING_PATTERN_TO_SEARCH_FOR, STRING_TO_SEARCH_WITHIN);
```

TODO:
- Currently building out support for multi-character graphemes. It currently only supports single-character graphemes, i.e. the english alphabet.

The original experiment (Now deprecated) began here:
https://github.com/AJTJ/rabin_karp