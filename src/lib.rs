mod utils;
use std::fmt::Error;

use js_sys::Uint32Array;
use unicode_segmentation::UnicodeSegmentation;
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
// #[cfg(feature = "wee_alloc")]
// #[global_allocator]
// static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

fn gen_hash(pattern: &[&str], prime: u32) -> Result<u32, Error> {
    let mut hash = 0;
    for c in pattern {
        // TODO: ADD MULTI-CHARACTER GRAPHEME HASHING
        let char_val_option = c.chars().next();
        let char_val = match char_val_option {
            Some(c) => c as u32,
            None => return Result::Err(Error),
        };
        hash = ((hash * 10) + char_val) % prime;
    }
    Ok(hash)
}

fn roll_hash(
    first_str: &str,
    pattern_len: usize,
    prev_hash_passed: u32,
    next_str: &str,
    prime: u32,
) -> Result<u32, Error> {
    let prev_hash = prev_hash_passed + prime;

    let mut multiplier = 1;
    let mut i = 1;
    while i < pattern_len {
        multiplier *= 10;
        multiplier %= prime;
        i += 1;
    }

    // TODO: ADD MULTI-CHARACTER GRAPHEME HASHING
    let first_char_option = first_str.chars().next();
    let next_char_option = next_str.chars().next();

    let first_char = match first_char_option {
        Some(c) => c as u32,
        None => return Result::Err(Error),
    };

    let next_char = match next_char_option {
        Some(c) => c as u32,
        None => return Result::Err(Error),
    };

    let hash_char_removed = (prev_hash - ((multiplier * first_char) % prime)) * 10;
    Ok((hash_char_removed + next_char) % prime)
}

#[wasm_bindgen]
pub fn find_matches(pattern_as_str: &str, text_as_str: &str) -> Result<Uint32Array, JsValue> {
    // call set_panic_hook once to get better error handling
    utils::set_panic_hook();

    // a prime to reduce the size of the values
    let prime = 461;

    // let other =
    let pattern_as_graphemes = pattern_as_str.graphemes(true).collect::<Vec<&str>>();
    // UnicodeSegmentation::graphemes(pattern_as_str, true).collect::<Vec<&str>>();

    let pattern_hash = gen_hash(&pattern_as_graphemes[..], prime).unwrap_throw();

    // the indices of the pattern
    let mut start = 0;
    let mut end = pattern_as_graphemes.len() - 1;

    // the previous hash
    let mut prev_hash: Option<u32> = None;

    // collect the matches
    let mut matches_found: Vec<u32> = vec![];

    let text_as_graphemes =
        UnicodeSegmentation::graphemes(text_as_str, true).collect::<Vec<&str>>();

    while end <= (text_as_graphemes.len() - 1) {
        let sub_string_as_graphemes = &text_as_graphemes[start..end + 1];
        let sub_string_hash: u32;
        if let Some(previous_hash) = prev_hash {
            let grapheme_being_dropped = text_as_graphemes[(start - 1)..start][0];
            let added_grapheme = text_as_graphemes[(end)..][0];
            let roll_hash_result = roll_hash(
                grapheme_being_dropped,
                pattern_as_graphemes.len(),
                previous_hash,
                added_grapheme,
                prime,
            );
            sub_string_hash = roll_hash_result.unwrap_throw();

            prev_hash = Some(sub_string_hash);
        } else {
            sub_string_hash = gen_hash(&text_as_graphemes[start..end + 1], prime).unwrap_throw();
            prev_hash = Some(sub_string_hash);
        }
        if sub_string_hash == pattern_hash && pattern_as_graphemes == sub_string_as_graphemes {
            matches_found.push(start as u32);
        }
        start += 1;
        end += 1;
    }

    Ok(Uint32Array::from(&matches_found[..]))
    // another possible return method
    // Box::from(&matches_found[..])
}
