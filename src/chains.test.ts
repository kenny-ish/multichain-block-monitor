import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize, type Block } from "./chains.ts";

const block = (n: number, ts: number, extra: Partial<Block> = {}): Block => ({
  number: "0x" + n.toString(16),
  timestamp: "0x" + ts.toString(16),
  gasUsed: "0x" + (15_000_000).toString(16),
  gasLimit: "0x" + (30_000_000).toString(16),
  transactions: [1, 2, 3],
  ...extra,
});

test("summarize derives block time and gas ratio", () => {
  const s = summarize(block(120, 1240, { baseFeePerGas: "0x3b9aca00" }), block(100, 1000));
  assert.equal(s.height, 120);
  assert.equal(s.blockTime, 12);
  assert.equal(s.gasRatio, 0.5);
  assert.equal(s.txs, 3);
  assert.equal(s.baseFeeGwei, 1);
});

test("missing base fee is null", () => {
  assert.equal(summarize(block(2, 4), block(1, 2)).baseFeeGwei, null);
});
