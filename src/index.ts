import { subDays, subMinutes, subHours, subMonths, subYears } from "date-fns";

interface Parser {
  matcher: RegExp;
  parser: (
    date: Date,
    value: string,
    input: string
  ) => { start: Date; end: Date };
}

const parsers: Parser[] = [
  {
    matcher:
      /\b(?:\w{3,9} \d{1,2}(?:, \d{4})?)\b(?:\s*(?:-)\s*)\b(?:\w{3,9} \d{1,2}(?:, \d{4})?)\b/,
    parser: (date: Date, _, input: string) => {
      const [start, end] = input.split("-");
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (startDate.getFullYear() < 2023 || endDate.getFullYear() < 2023) {
        startDate.setFullYear(date.getFullYear());
        endDate.setFullYear(date.getFullYear());
      }

      return { start: startDate, end: endDate };
    },
  },
  {
    matcher: /\d{1,2}\/\d{1,2}(\/\d{2,4})?\s*-\s*\d{1,2}\/\d{1,2}(\/\d{2,4})?/,
    parser: (date: Date, _, input: string) => {
      const [start, end] = input.split("-");
      const startDate = new Date(start);
      const endDate = new Date(end);

      if (startDate.getFullYear() < 2023 || endDate.getFullYear() < 2023) {
        startDate.setFullYear(date.getFullYear());
        endDate.setFullYear(date.getFullYear());
      }

      return { start: startDate, end: endDate };
    },
  },
  {
    matcher: /day before yesterday/,
    parser: (date: Date) => {
      return { start: subDays(date, 2), end: date };
    },
  },
  {
    matcher: /today/,
    parser: (date: Date) => {
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0);

      return { start: newDate, end: date };
    },
  },
  {
    matcher: /last month/,
    parser: (date: Date) => {
      return { start: subMonths(date, 1), end: date };
    },
  },
  {
    matcher: /yesterday/,
    parser: (date: Date) => {
      return { start: subDays(date, 1), end: date };
    },
  },
  {
    matcher: /last week/,
    parser: (date: Date) => {
      return { start: subDays(date, 7), end: date };
    },
  },
  {
    matcher: /last (hour|hr)/,
    parser: (date: Date) => {
      return { start: subHours(date, 1), end: date };
    },
  },
  {
    matcher: /(ytd|year to date)/,
    parser: (date: Date) => {
      return { start: new Date(date.getFullYear(), 0, 1), end: date };
    },
  },
  {
    matcher: /(\d+)\s*(?:months?|m)/,
    parser: (date: Date, value: string) => {
      return { start: subMonths(date, parseInt(value)), end: date };
    },
  },
  {
    matcher: /(\d+)\s*(?:years?|y)/,
    parser: (date: Date, value: string) => {
      return { start: subYears(date, parseInt(value)), end: date };
    },
  },
  {
    matcher: /(\d+)\s*(?:weeks?|w)/,
    parser: (date: Date, value: string) => {
      return { start: subDays(date, parseInt(value) * 7), end: date };
    },
  },
  {
    matcher: /(\d+)\s*(?:minutes?|mins?|m)/,
    parser: (date: Date, value: string) => {
      return { start: subMinutes(date, parseInt(value)), end: date };
    },
  },
  {
    matcher: /(\d+)\s*(?:days?|d)/,
    parser: (date: Date, value: string) => {
      return { start: subDays(date, parseInt(value)), end: date };
    },
  },
  {
    matcher: /(\d+)\s*(?:hours?|hrs?|h)/,
    parser: (date: Date, value: string) => {
      return { start: subHours(date, parseInt(value)), end: date };
    },
  },
];

export function parse(
  date: string,
  currentDate: Date = new Date()
): { start: Date; end: Date } | null {
  date = date.toLowerCase();

  const parser = parsers.find((parser: Parser) => {
    return parser.matcher.test(date);
  });

  if (!parser) {
    const newDate = new Date(date);
    if (newDate.toString() === "Invalid Date") {
      return null;
    }

    return { start: newDate, end: currentDate };
  }

  const regex = parser?.matcher.exec(date);

  if (regex) {
    return parser.parser(currentDate, regex[0], date);
  }

  return null;
}
