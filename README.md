# `⏰ meridiem`

Meridiem is a simple, lightweight and fast library written in TypeScript for parsing natural language time ranges (in the past) and converting them to a simple object. Powered by some simple RegEx patterns and the built-in `new Date()` parser. Inspired by [chrono](
    https://github.com/wanasit/chrono
) and this [tweet](https://twitter.com/JohnPhamous/status/1630763699849015298) from @JohnPhamous about the new Vercel date range selector.

Has troubles with very large time ranges. Will work best if kept within 2-3 years of provided `currentDate` or the current date.

Compatible with Node, the browser, Deno and Bun. Only dependency is `date-fns`.

## Installation

```bash
# npm
npm install @metrik/meridiem
 
# yarn
yarn add @metrik/meridiem

# pnpm
pnpm add @metrik/meridiem
```

## Usage

```js
import { parse } from "@metrik/meridiem"

// You can pass a string to parse
const basicResult = parse("last week")

// {
//   start: 2023-03-10T00:00:00.000Z,
//   end: 2023-03-17T00:00:00.000Z
// }

// You can also pass a date to parse relative to
const relativeResult = parse("last week", new Date("January 1, 2023"))

// {
//   start: 2023-12-25T00:00:00.000Z,
//   end: 2023-01-01T00:00:00.000Z
// }

// Meridiem can also do real date ranges
const realResult = parse("1/1 - 1/2")

// {
//   start: 2023-01-01T00:00:00.000Z,
//   end: 2023-01-02T00:00:00.000Z
// }

// If the date range is invalid, null is returned
const invalidResult = parse("invalid date range") // null
```

