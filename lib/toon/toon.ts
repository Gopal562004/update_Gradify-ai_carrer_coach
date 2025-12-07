// src/lib/toon.ts
export type ToonValue =
  | string
  | number
  | boolean
  | null
  | ToonObject
  | ToonValue[];

export interface ToonObject {
  [key: string]: ToonValue;
}

/**
 * Robust, tolerant TOON parser:
 * - supports newline/space variations around ":"
 * - supports compact arrays with '@'
 * - stitches basic tokens into an object
 */
export function parseToon(input: string): ToonObject {
  const tokens = tokenize(input);
  let pos = 0;

  function peek() {
    return tokens[pos];
  }
  function next() {
    return tokens[pos++];
  }
  function expect(value: string) {
    const t = next();
    if (t !== value) throw new Error(`Expected '${value}' but got '${t}'`);
  }

  function parseValue(): ToonValue {
    const t = peek();
    if (!t) return null;
    if (t === "{") return parseObject();
    if (t === "@") {
      next();
      return parseCompactArray();
    }
    if (t === "[") return parseArray();
    if (/^-?\d+$/.test(t)) {
      next();
      return parseInt(t, 10);
    }
    if (t === "true" || t === "false") {
      next();
      return t === "true";
    }
    if (t === "null") {
      next();
      return null;
    }
    // atom/string
    next();
    return t;
  }

  function parseObject(): ToonObject {
    const obj: ToonObject = {};
    expect("{");
    while (peek() && peek() !== "}") {
      // Key may be on its own token
      let key = next();

      // tolerate stray newlines/spaces before colon
      while (peek() && peek() !== ":") {
        // if next token is colon, break
        if (peek() === ":") break;
        // If we accidentally consumed part of a key (rare), continue
        // but do not infinite loop
        break;
      }

      // if colon missing but present as separate token, advance until colon
      if (peek() !== ":") {
        let foundColon = false;
        for (let i = pos; i < tokens.length; i++) {
          if (tokens[i] === ":") {
            // advance pos to that colon
            pos = i;
            foundColon = true;
            break;
          }
        }
        if (!foundColon) {
          throw new Error(`Missing ':' after key '${key}'`);
        }
      }

      expect(":");

      // skip any newline tokens
      while (peek() === "\n") next();

      const val = parseValue();
      obj[key] = val;
    }
    expect("}");
    return obj;
  }

  function parseArray(): ToonValue[] {
    const arr: ToonValue[] = [];
    expect("[");
    while (peek() && peek() !== "]") {
      arr.push(parseValue());
    }
    expect("]");
    return arr;
  }

  function parseCompactArray(): ToonValue[] {
    const arr: ToonValue[] = [];
    while (peek() && peek() !== "}" && peek() !== "]") {
      arr.push(parseValue());
    }
    return arr;
  }

  return parseObject();
}

function tokenize(input: string): string[] {
  return input
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/\n+/g, "\n")
    .split(/([\{\}\[\]\:\@\n])/g)
    .map((t) => t.trim())
    .filter(Boolean);
}
