import { Arc82, Arc82Utils } from "arcraft";

async function main() {
  const arc82Uri = Arc82.buildAppUri(739833611, {
    global: [Arc82.encodeBase64Url("bWFuYWdlcg==")],
    box: [Arc82.encodeBase64Url("bQAAAAArzZHW"), Arc82.encodeBase64Url("AAAAACV9JpE=")],
  }); // arc82Uri algorand://app/739833611?box=YlFBQUFBQXJ6WkhX&global=YldGdVlXZGxjZz09
  console.log(`arc82Uri: ${arc82Uri}\n`);

  const extractedId = Arc82.extractId(arc82Uri); // extractedId 739833611
  console.log(`extractedId: ${extractedId}\n`);

  const extractedType = Arc82.extractType(arc82Uri); // extractedType app
  console.log(`extractedType: ${extractedType}\n`);

  const isValidArc82Uri = Arc82.isValidArc82Uri(arc82Uri); // isValidArc82Uri true
  console.log(`isValidArc82Uri: ${isValidArc82Uri}\n`);

  const isValidGrammar = Arc82Utils.validateGrammar(arc82Uri); // isValidGrammar { valid: true, errors: [] }
  console.log(`isValidGrammar: ${JSON.stringify(isValidGrammar, null, 2)}\n`);

  const parsed = Arc82.parse(arc82Uri);
  // parsed {
  //   type: 'app',
  //   id: 739833611,
  //   originalUri: 'algorand://app/739833611?box=YlFBQUFBQXJ6WkhX&global=YldGdVlXZGxjZz09',
  //   appParams: { box: [ 'YlFBQUFBQXJ6WkhX' ], global: [ 'YldGdVlXZGxjZz09' ] }
  // }
  console.log(`parsed: ${JSON.stringify(parsed, null, 2)}\n`);

  const query = await Arc82.queryApplication(parsed, "testnet"); // or const query2 = await Arc82.queryFromUri(arc82Uri, "testnet");

  console.log(`query: ${JSON.stringify(query, null, 2)}\n`);
  // query {
  //   appId: 739833611,
  //   exists: true,
  //   success: true,
  //   error: undefined,
  //   boxes: [
  //     {
  //       key: 'YlFBQUFBQXJ6WkhX',
  //       decodedKey: 'bQAAAAArzZHW',
  //       value: 'AAZ/F0o3HwPobVZApzUP0+PXQj/9m/1aEhwyb873w8S+3wQSwesEMMsklztiAMrZe4q8FnPZM8sZ0I7+dum+RajTAABJMzHL8fNFCkkX19+VWub83Km7BjwVM4KxuV2pvZBkNQSfMs+B/N3lJoj0WXijIxG7Y4BI7zUQ0HoOuTyrLCPkS1BybTkbzd5lMcygzwdB7bAfttHAfo7Sk0SAqJ8CWQxGjZCCU2lCp4lVvxH/NNm2TRuo9mbruGKT5hAx31M=',
  //       exists: true,
  //       error: undefined
  //     }
  //   ],
  //   global: [
  //     {
  //       key: 'YldGdVlXZGxjZz09',
  //       decodedKey: 'bWFuYWdlcg==',
  //       value: [Uint8Array],
  //       valueType: 'bytes',
  //       decodedValue: '\x7F\x17J7\x1F\x03�mV@�5\x0F���B?���Z\x12\x1C2o���ľ�',
  //       exists: true,
  //       error: undefined
  //     }
  //   ]
  // }
}

main();
