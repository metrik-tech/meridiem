import { parse } from "./src/index";
import { describe, expect, test } from "@jest/globals";

test("invalid date", () => {
  expect(parse("invalid date")).toBeNull();
});

test("invalid date with date", () => {
  expect(parse("invalid date", new Date("January 1, 2022"))).toBeNull();
});

test("slash format date range", () => {
  expect(parse("1/1 - 1/2", new Date("January 5, 2022"))).toEqual({
    start: new Date("January 1, 2022"),
    end: new Date("January 2, 2022"),
  });
});

test("slash format date range with year", () => {
  expect(parse("1/1/2022 - 1/2/2022", new Date("January 5, 2022"))).toEqual({
    start: new Date("January 1, 2022"),
    end: new Date("January 2, 2022"),
  });
});

describe("relative ranges", () => {
  test("weird capitalization", () => {
    expect(parse("lASt wEEk", new Date("January 5, 2022"))).toEqual({
      start: new Date("December 29, 2021"),
      end: new Date("January 5, 2022"),
    });
  });

  test("last week", () => {
    expect(parse("last week", new Date("January 5, 2022"))).toEqual({
      start: new Date("December 29, 2021"),
      end: new Date("January 5, 2022"),
    });
  });

  test("yesterday", () => {
    expect(parse("yesterday", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 4, 2022"),
      end: new Date("January 5, 2022"),
    });
  });

  test("today", () => {
    const newDate = new Date("January 5, 2022");
    newDate.setHours(0, 0, 0, 0);

    expect(parse("today", new Date("January 5, 2022"))).toEqual({
      start: newDate,
      end: new Date("January 5, 2022"),
    });
  });

  test("day before yesterday", () => {
    expect(parse("day before yesterday", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 3, 2022"),
      end: new Date("January 5, 2022"),
    });
  });

  test("last month", () => {
    expect(parse("last month", new Date("January 5, 2022"))).toEqual({
      start: new Date("December 5, 2021"),
      end: new Date("January 5, 2022"),
    });
  });

  test("year to date", () => {
    expect(parse("year to date", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 1, 2022"),
      end: new Date("January 5, 2022"),
    });
    expect(parse("ytd", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 1, 2022"),
      end: new Date("January 5, 2022"),
    });
  });

  test("last hour", () => {
    expect(parse("last hour", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 4, 2022 23:00"),
      end: new Date("January 5, 2022 00:00"),
    });
    expect(parse("last hr", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 4, 2022 23:00"),
      end: new Date("January 5, 2022 00:00"),
    });
  });

  test("hours", () => {
    expect(parse("last 12 hours", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 4, 2022 12:00"),
      end: new Date("January 5, 2022 00:00"),
    });
    expect(parse("last 12 hrs", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 4, 2022 12:00"),
      end: new Date("January 5, 2022 00:00"),
    });
    expect(parse("12h", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 4, 2022 12:00"),
      end: new Date("January 5, 2022 00:00"),
    });
    expect(parse("12hrs", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 4, 2022 12:00"),
      end: new Date("January 5, 2022 00:00"),
    });
    expect(
      parse(
        "detect the range $$$!!! hello last 12 hours other content power of regex 12312",
        new Date("January 5, 2022")
      )
    ).toEqual({
      start: new Date("January 4, 2022 12:00"),
      end: new Date("January 5, 2022 00:00"),
    });
  });

  test("months", () => {
    expect(parse("last 2 months", new Date("January 5, 2022"))).toEqual({
      start: new Date("November 5, 2021"),
      end: new Date("January 5, 2022"),
    });
  });

  test("years", () => {
    expect(parse("last 5 years", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 5, 2017"),
      end: new Date("January 5, 2022"),
    });

    expect(parse("5y", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 5, 2017"),
      end: new Date("January 5, 2022"),
    });

    expect(parse("5 yrs", new Date("January 5, 2022"))).toEqual({
      start: new Date("January 5, 2017"),
      end: new Date("January 5, 2022"),
    });
  });

  test("weeks", () => {
    expect(parse("last 2 weeks", new Date("January 5, 2022"))).toEqual({
      start: new Date("December 22, 2021"),
      end: new Date("January 5, 2022"),
    });

    expect(parse("2w", new Date("January 5, 2022"))).toEqual({
      start: new Date("December 22, 2021"),
      end: new Date("January 5, 2022"),
    });

    expect(parse("2 wk", new Date("January 5, 2022"))).toEqual({
      start: new Date("December 22, 2021"),
      end: new Date("January 5, 2022"),
    });
  });

  test("minutes", () => {
    expect(parse("last 5 minutes", new Date("January 5, 2022 00:05"))).toEqual({
      start: new Date("January 5, 2022"),
      end: new Date("January 5, 2022 00:05"),
    });

    expect(parse("5min", new Date("January 5, 2022 00:05"))).toEqual({
      start: new Date("January 5, 2022"),
      end: new Date("January 5, 2022 00:05"),
    });

    expect(parse("5 mins", new Date("January 5, 2022 00:05"))).toEqual({
      start: new Date("January 5, 2022"),
      end: new Date("January 5, 2022 00:05"),
    });

    expect(parse("5m", new Date("January 5, 2022 00:05"))).toEqual({
      start: new Date("January 5, 2022"),
      end: new Date("January 5, 2022 00:05"),
    });
  });

  test("days", () => {
    expect(parse("last 5 days", new Date("January 5, 2022"))).toEqual({
      start: new Date("December 31, 2021"),
      end: new Date("January 5, 2022"),
    });

    expect(parse("5d", new Date("January 5, 2022"))).toEqual({
      start: new Date("December 31, 2021"),
      end: new Date("January 5, 2022"),
    });

    expect(parse("5 day", new Date("January 5, 2022"))).toEqual({
      start: new Date("December 31, 2021"),
      end: new Date("January 5, 2022"),
    });
  });
});
