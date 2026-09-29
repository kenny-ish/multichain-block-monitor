import { parseArgs } from "node:util";
import { CHAINS, summarize, type Block, type Stats } from "./chains.ts";

async function getBlock(rpc: string, tag: string): Promise<Block> {
  const res = await fetch(rpc, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_getBlockByNumber", params: [tag, false] }),
    signal: AbortSignal.timeout(8000),
  });
  const body = (await res.json()) as { result?: Block; error?: { message: string } };
  if (!body.result) throw new Error(body.error?.message ?? `HTTP ${res.status}`);
  return body.result;
}

async function chainStats(rpc: string): Promise<Stats> {
  const latest = await getBlock(rpc, "latest");
  const older = await getBlock(rpc, "0x" + (parseInt(latest.number, 16) - 20).toString(16));
  return summarize(latest, older);
}

async function render(names: string[]): Promise<void> {
  const results = await Promise.allSettled(names.map((n) => chainStats(CHAINS[n])));
  console.log(`\n${"chain".padEnd(10)}${"block".padStart(14)}${"blk time".padStart(10)}${"txs".padStart(6)}${"gas used".padStart(10)}  base fee`);
  results.forEach((r, i) => {
    const name = names[i].padEnd(10);
    if (r.status === "rejected") {
      console.log(`${name}  error: ${(r.reason as Error).message}`);
      return;
    }
    const s = r.value;
    const fee = s.baseFeeGwei === null ? "-" : `${Number(s.baseFeeGwei.toPrecision(3))} gwei`;
    console.log(
      `${name}${s.height.toLocaleString("en-US").padStart(14)}${`${s.blockTime.toFixed(1)}s`.padStart(10)}` +
        `${String(s.txs).padStart(6)}${`${(s.gasRatio * 100).toFixed(1)}%`.padStart(10)}  ${fee}`,
    );
  });
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: { chains: { type: "string" }, watch: { type: "string" } },
  });
  const names = values.chains ? values.chains.split(",") : Object.keys(CHAINS);
  for (const n of names) if (!CHAINS[n]) throw new Error(`unknown chain ${n}`);
  await render(names);
  if (values.watch) setInterval(() => void render(names), Number(values.watch) * 1000);
}

main().catch((e: Error) => {
  console.error(e.message);
  process.exit(1);
});
