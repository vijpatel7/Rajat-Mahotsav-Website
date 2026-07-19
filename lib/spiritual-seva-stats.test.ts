import { describe, expect, it } from "vitest"

import {
  SPIRITUAL_SEVA_STAT_KEYS,
  buildSpiritualSevaStats,
  normalizeSpiritualSevaStats,
} from "./spiritual-seva-stats"

describe("spiritual seva stats", () => {
  it("normalizes missing, null, and string totals into finite non-negative numbers", () => {
    expect(
      normalizeSpiritualSevaStats({
        total_submissions: "12",
        jaap: "1000",
        malas: "250",
        dhyan: null,
        pradakshinas: undefined,
        dandvats: -5,
        padyatras: Number.NaN,
        sadachar: 2.8,
        harignanamrut: "bad",
        bapashree: 1,
        upvas: 0,
      })
    ).toEqual({
      total_submissions: 12,
      jaap: 1000,
      malas: 250,
      dhyan: 0,
      pradakshinas: 0,
      dandvats: 0,
      padyatras: 0,
      sadachar: 2.8,
      harignanamrut: 0,
      bapashree: 1,
      upvas: 0,
    })
  })

  it("builds spiritual stats from raw submission rows without dropping rows", () => {
    const rows = [
      { jaap: 100, malas: 10, dhyan: 20, pradakshinas: 30, dandvats: 40, padyatras: 1, upvas: 2 },
      { malas: 5, dhyan: null, pradakshinas: "7", sadachar: 1, harignanamrut: 1, bapashree: 1 },
      { jaap: "50", malas: "not-a-number", dhyan: 15, pradakshinas: -10, dandvats: 5, padyatras: 2 },
    ]

    expect(buildSpiritualSevaStats(rows)).toEqual({
      total_submissions: 3,
      jaap: 150,
      malas: 15,
      dhyan: 35,
      pradakshinas: 37,
      dandvats: 45,
      padyatras: 3,
      sadachar: 1,
      harignanamrut: 1,
      bapashree: 1,
      upvas: 2,
    })
  })

  it("keeps the public stat keys aligned with spiritual seva submission columns", () => {
    expect(SPIRITUAL_SEVA_STAT_KEYS).toEqual([
      "jaap",
      "malas",
      "dhyan",
      "pradakshinas",
      "dandvats",
      "padyatras",
      "sadachar",
      "harignanamrut",
      "bapashree",
      "upvas",
    ])
  })
})
