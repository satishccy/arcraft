import { Arc82, Arc82Utils } from "arcraft";

async function main() {
  const arc82Uri = Arc82.buildAssetUri(732071363, {
    total: true,
    decimals: true,
    unitname: true,
    reserve: true,
    assetname: true,
  }); // arc82Uri algorand://asset/732071363?total=&decimals=&unitname=&reserve=&assetname=
  console.log(`arc82Uri: ${arc82Uri}\n`);

  const extractedId = Arc82.extractId(arc82Uri); // extractedId 732071363
  console.log(`extractedId: ${extractedId}\n`);

  const extractedType = Arc82.extractType(arc82Uri); // extractedType asset
  console.log(`extractedType: ${extractedType}\n`);

  const isValidArc82Uri = Arc82.isValidArc82Uri(arc82Uri); // isValidArc82Uri true
  console.log(`isValidArc82Uri: ${isValidArc82Uri}\n`);

  const isValidGrammar = Arc82Utils.validateGrammar(arc82Uri); // isValidGrammar { valid: true, errors: [] }
  console.log(`isValidGrammar: ${isValidGrammar}\n`);

  const parsed = Arc82.parse(arc82Uri);
  //   parsed {
  //     type: 'asset',
  //     id: 732071363,
  //     originalUri: 'algorand://asset/732071363?total=&decimals=&unitname=&reserve=&assetname=',
  //     assetParams: {
  //       total: true,
  //       decimals: true,
  //       unitname: true,
  //       assetname: true,
  //       reserve: true
  //     }
  //   }
  console.log(`parsed: ${JSON.stringify(parsed, null, 2)}\n`);

  const query = await Arc82.queryAsset(parsed, "testnet"); // or const query2 = await Arc82.queryFromUri(arc82Uri, "testnet");
  console.log(`query: ${JSON.stringify(query, null, 2)}\n`);
  //   query {
  //     assetId: 732071363,
  //     parameters: {
  //       total: 1000000000,
  //       decimals: 3,
  //       unitname: 'SVECW',
  //       assetname: 'SVECW Token',
  //       reserve: 'AQJMD2YEGDFSJFZ3MIAMVWL3RK6BM46ZGPFRTUEO7Z3OTPSFVDJ4JFG5DI'
  //     },
  //     exists: true,
  //     success: true,
  //     error: undefined
  //   }
}

main();
