import { Arc19, Arc3, Arc69, AssetFactory, CoreAsset } from 'arcraft';

async function main() {
  const asset: CoreAsset | Arc3 | Arc69 | Arc19 = await AssetFactory.fromId(
    739833611,
    'mainnet'
  );
  // will return respective arc instance without manual initialization

  const arcType = await AssetFactory.getArcType(739833611, 'mainnet');
  // arcType: arc3 or arc19 or arc69 or unknown
}

main();
