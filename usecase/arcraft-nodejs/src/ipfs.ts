import { IPFS } from "arcraft";
import path from "path";
import { PINATA_JWT, FILEBASE_API_TOKEN } from "./config";
async function main() {
  const pinataIpfs = new IPFS("pinata", {
    provider: "pinata",
    jwt: PINATA_JWT,
  });

  const filebaseIpfs = new IPFS("filebase", {
    provider: "filebase",
    token: FILEBASE_API_TOKEN,
  });

  const imageCid = await pinataIpfs.upload(path.join(__dirname, "./images/test.png"));
  console.log(`imageCid: ${imageCid}\n`);
  // imageCid QmXY74mcjLMBFL98jqH9EYvd2RpYJF9QED4qTLEgygTkjw

  const imageCid2 = await filebaseIpfs.upload(
    path.join(__dirname, "./images/juan.webp")
  );
  console.log(`imageCid2: ${imageCid2}\n`);
  // imageCid2 QmazNgsKNGCmZVj33BhJyMMvvbPh3ptrM13oHN6Q7dwEhA

  const imageCid3 = await pinataIpfs.uploadJson({
    name: "test",
    description: "test",
    image: imageCid,
  });
  console.log(`imageCid3: ${imageCid3}\n`);
  // imageCid3 QmZ1234567890123456789012345678901234567890

  const imageCid4 = await filebaseIpfs.uploadJson({
    name: "test",
    description: "test",
    image: imageCid2,
  });
  console.log(`imageCid4: ${imageCid4}\n`);
  // imageCid4 QmZ1234567890123456789012345678901234567890
}

main();
