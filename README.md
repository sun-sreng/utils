# @gmana/utils

**Work in progress** A collection of useful routines to simplify cross runtime (Node, Deno and Bun) development.

Available for Node, Deno Bun and Browser at [jsr.io/@gmana/utils](https://jsr.io/@gmana/utils), and works seamlessly with both JavaScript and TypeScript.

## Installation

Full instructions available at at [jsr.io](https://jsr.io/@gmana/utils), short version:

```bash
# Deno
deno add @gmana/utils

# Node
npx jsr add @gmana/utils

# Bun
bunx jsr add @gmana/utils
```

## Methods

### slugify

```js
import { slugify } from "@gmana/utils";

console.log(slugify(" Git$Hub_ request^% spLit lET_Ter "));
// github-request-split-letter
```
