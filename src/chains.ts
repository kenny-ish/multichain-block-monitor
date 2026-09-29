export const CHAINS: Record<string, string> = {
  ethereum: "https://ethereum-rpc.publicnode.com",
  base: "https://mainnet.base.org",
  arbitrum: "https://arbitrum-one-rpc.publicnode.com",
  optimism: "https://optimism-rpc.publicnode.com",
  polygon: "https://polygon.drpc.org",
  bsc: "https://bsc-rpc.publicnode.com",
};

export interface Block {
  number: string;
  timestamp: string;
  gasUsed: string;
  gasLimit: string;
  baseFeePerGas?: string;
  transactions: unknown[];
}

export interface Stats {
  height: number;
  blockTime: number;
  txs: number;
  gasRatio: number;
  baseFeeGwei: number | null;
}

export function summarize(latest: Block, older: Block): Stats {
  const h = parseInt(latest.number, 16);
  const span = h - parseInt(older.number, 16);
  const dt = parseInt(latest.timestamp, 16) - parseInt(older.timestamp, 16);
  return {
    height: h,
    blockTime: span > 0 ? dt / span : Number.NaN,
    txs: latest.transactions.length,
    gasRatio: parseInt(latest.gasUsed, 16) / parseInt(latest.gasLimit, 16),
    baseFeeGwei: latest.baseFeePerGas ? parseInt(latest.baseFeePerGas, 16) / 1e9 : null,
  };
}
