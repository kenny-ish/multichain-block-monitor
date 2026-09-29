# multichain-block-monitor

A table of block height, block time, gas usage and base fee for Ethereum, Base, Arbitrum, Optimism,
Polygon and BSC.

```bash
node src/index.ts
node src/index.ts --watch 10
node src/index.ts --chains ethereum,base
```

```
chain              block  blk time   txs  gas used  base fee
ethereum      26,040,289     12.0s   259     49.9%  0.312 gwei
base          51,689,248      2.0s   354     14.3%  0.005 gwei
arbitrum     508,125,877      0.3s     6      0.0%  0.02 gwei
optimism     157,284,533      2.0s    38     58.2%  5.46e-7 gwei
polygon       94,308,492      1.5s    79     12.3%  243 gwei
bsc          123,568,045      0.5s   114     46.3%  0 gwei
```

For each chain it fetches the latest block and the block 20 before it, and takes the average block
time from their timestamps. Gas used is `gasUsed / gasLimit` of the latest block.

The endpoints are free public ones. Change `CHAINS` in `src/chains.ts` to use your own.

```bash
npm test
```
