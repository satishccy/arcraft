import { Arc62 } from 'arcraft';

async function main() {
  const testnetArc62AssetId = 733094741;
  const mainnetArc62AssetId = 2934354727;

  const testnetIsArc62Compatible = await Arc62.isArc62Compatible(
    testnetArc62AssetId,
    'testnet'
  );
  console.log(
    `Testnet is ARC62 compatible: ${testnetIsArc62Compatible.compatible}`
  );

  const testnetCirculatingSupply = await Arc62.getCirculatingSupply(
    testnetArc62AssetId,
    'testnet'
  );
  console.log(`Testnet ARC62 circulating supply: ${testnetCirculatingSupply}`);

  const mainnetIsArc62Compatible = await Arc62.isArc62Compatible(
    mainnetArc62AssetId,
    'mainnet'
  );
  console.log(
    `Mainnet is ARC62 compatible: ${mainnetIsArc62Compatible.compatible}`
  );

  const mainnetCirculatingSupply = await Arc62.getCirculatingSupply(
    mainnetArc62AssetId,
    'mainnet'
  );
  console.log(`Mainnet ARC62 circulating supply: ${mainnetCirculatingSupply}`);
}
main();
