


export class Arc62 {

    fetchAssetDetails = async (idToFetch: number, network: Network) => {
        try {
          let IsArc62 = false;
          let arc62AppId = 0;
    
          const indexerURL = getIndexerURL(activeNetwork);
          const res = (await axios.get(`${indexerURL}/v2/assets/${assetId}`)).data;
          if (res.asset) {
            const assetFormat = findFormat(res.asset.params.url);
            let assetMetadata;
            try {
              if (assetFormat === "ARC19") {
                const data = await getARC19AssetMetadataData(
                  res.asset.params.url,
                  res.asset.params.reserve
                );
                if (typeof data === "string") {
                  assetMetadata = JSON.parse(data);
                } else {
                  assetMetadata = data;
                }
              } else if (assetFormat === "ARC69" || assetFormat === "ARC3") {
                if (res.asset.params.url.startsWith("ipfs://")) {
                  const data = await axios
                    .get(
                      IPFS_ENDPOINT + res.asset.params.url.replace("ipfs://", "")
                    )
                    .then((res) => res.data);
                  if (typeof data === "string") {
                    assetMetadata = JSON.parse(data);
                  } else {
                    assetMetadata = data;
                  }
                } else if (res.asset.params.url.includes("ipfs/")) {
                  const data = await axios
                    .get(IPFS_ENDPOINT + res.asset.params.url.split("ipfs/")[1])
                    .then((res) => res.data);
                  if (typeof data === "string") {
                    assetMetadata = JSON.parse(data);
                  } else {
                    assetMetadata = data;
                  }
                } else {
                  const data = await axios
                    .get(res.asset.params.url)
                    .then((res) => res.data);
                  if (typeof data === "string") {
                    assetMetadata = JSON.parse(data);
                  } else {
                    assetMetadata = data;
                  }
                }
              }
            } catch (e) {
              const arc69 = new Arc69();
              assetMetadata = await arc69.fetch(Number(assetId), activeNetwork);
              console.error(e);
            }
    
            if (assetMetadata && assetMetadata.properties) {
              if (
                assetMetadata.properties["arc-62"] &&
                assetMetadata.properties["arc-62"]["application-id"]
              ) {
                IsArc62 = true;
                arc62AppId = Number(
                  assetMetadata.properties["arc-62"]["application-id"]
                );
              }
            }
            const manager = res.asset.params.manager || ALGORAND_ZERO_ADDRESS;
            const reserve = res.asset.params.reserve || ALGORAND_ZERO_ADDRESS;
            const freeze = res.asset.params.freeze || ALGORAND_ZERO_ADDRESS;
            const clawback = res.asset.params.clawback || ALGORAND_ZERO_ADDRESS;
            const creator = res.asset.params.creator || ALGORAND_ZERO_ADDRESS;
            const decimals = Number(res.asset.params.decimals) || 0;
            const name = res.asset.params.name || "Asset Name";
            const unitName = res.asset.params["unit-name"] || "UNIT";
            const totalSupply =
              Number(res.asset.params.total) / 10 ** decimals || 0;
    
            if (!IsArc62) {
              const reconfigs = [];
              let configtxns = (
                await axios.get(
                  `${indexerURL}/v2/assets/${assetId}/transactions?tx-type=${"acfg"}&note-prefix=${stringToBase64(
                    "arc62:"
                  )}`
                )
              ).data;
              for (let i = 0; i < configtxns.transactions.length; i++) {
                reconfigs.push(configtxns.transactions[i]);
              }
              while (configtxns["next-token"]) {
                configtxns = (
                  await axios.get(
                    `${indexerURL}/v2/assets/${assetId}/transactions?tx-type=${"acfg"}&note-prefix=${stringToBase64(
                      "arc62:"
                    )}&next=${configtxns["next-token"]}`
                  )
                ).data;
                for (let i = 0; i < configtxns.transactions.length; i++) {
                  reconfigs.push(configtxns.transactions[i]);
                }
              }
              const latest = reconfigs[reconfigs.length - 1];
              if (latest) {
                const note = latest.note;
                const decoder = new TextDecoder();
                const encoder = new TextEncoder();
                const noteStr = base64ToUint8Array(note);
                const noteStrDecoded = decoder.decode(noteStr);
                const arc62 = noteStrDecoded.split("arc62:");
                if (arc62.length > 1 && arc62[1][0] === "j") {
                  const json = JSON.parse(arc62[1].slice(1));
                  if (json["application-id"]) {
                    IsArc62 = true;
                    arc62AppId = Number(json["application-id"]);
                  }
                } else if (arc62.length > 1 && arc62[1][0] === "m") {
                  const msgpack = encoder.encode(arc62[1].slice(1));
                  const decoded = algosdk.decodeObj(msgpack) as any;
                  if (decoded["application-id"]) {
                    IsArc62 = true;
                    arc62AppId = Number(decoded["application-id"]);
                  }
                }
              }
            }
    
            let arc62Data: Arc62Data | null = null;
            try {
              if (IsArc62) {
                const algorand = algokit.AlgorandClient.fromClients({
                  algod: algodClient,
                });
                const sender = activeAddress;
                const signer = algosdk.makeEmptyTransactionSigner();
                const caller = new CirculatingSupplyFactory({
                  algorand,
                  defaultSigner: signer,
                  defaultSender: sender,
                }).getAppClientById({ appId: BigInt(arc62AppId) });
                const globalState = await caller.appClient.getGlobalState();
                const otherKeys = Object.keys(globalState).filter((key) => {
                  return key !== "asset_id";
                });
                if (
                  globalState.asset_id &&
                  globalState.asset_id.value === BigInt(assetId) &&
                  otherKeys.length === 3
                ) {
                  const circulatingSupply = (
                    await caller
                      .newGroup()
                      .arc62GetCirculatingSupply({
                        args: { assetId: assetId },
                        sender: sender,
                        signer: signer,
                      })
                      .simulate({
                        allowEmptySignatures: true,
                        allowUnnamedResources: true,
                        fixSigners: true,
                      })
                  ).returns[0];
                  const value1 = algosdk.encodeAddress(
                    (globalState[otherKeys[0]] as any).valueRaw as Uint8Array
                  );
                  const value1Held = await getAssetHolding(
                    value1,
                    algorand,
                    assetId
                  );
                  const value2 = algosdk.encodeAddress(
                    (globalState[otherKeys[1]] as any).valueRaw as Uint8Array
                  );
                  const value2Held = await getAssetHolding(
                    value2,
                    algorand,
                    assetId
                  );
                  const value3 = algosdk.encodeAddress(
                    (globalState[otherKeys[2]] as any).valueRaw as Uint8Array
                  );
                  const value3Held = await getAssetHolding(
                    value3,
                    algorand,
                    assetId
                  );
                  arc62Data = {
                    label1: {
                      key: otherKeys[0],
                      value: value1,
                      amountHeld:
                        value1Held == -1 ? 0 : value1Held / 10 ** decimals,
                    },
                    label2: {
                      key: otherKeys[1],
                      value: value2,
                      amountHeld:
                        value2Held == -1 ? 0 : value2Held / 10 ** decimals,
                    },
                    label3: {
                      key: otherKeys[2],
                      value: value3,
                      amountHeld:
                        value3Held == -1 ? 0 : value3Held / 10 ** decimals,
                    },
                    circulatingSupply: Number(circulatingSupply) / 10 ** decimals,
                  };
                } else {
                  throw new Error("Invalid App ID mentioned For the Asset");
                }
              }
            } catch (e) {
              toast.error("Unable to resolve circulating supply from the app");
              console.error(e);
              IsArc62 = false;
              arc62AppId = 0;
            }
    
            const reserveHeld = await getAssetHolding(reserve, algorand, assetId);
    
            const assetData: AssetData = {
              assetId,
              manager,
              name,
              unitName,
              totalSupply,
              decimals,
              freeze,
              reserveHoldings: reserveHeld == -1 ? 0 : reserveHeld / 10 ** decimals,
              clawback,
              creator,
              reserve,
              isArc62: IsArc62,
              arc62AppId,
              arc62Data,
            };
            setLabel1(assetData.arc62Data?.label1.value || "");
            setLabel2(assetData.arc62Data?.label2.value || "");
            setLabel3(assetData.arc62Data?.label3.value || "");
            setAssetData(assetData);
            setAssetId(assetId);
            toast.success("Asset details fetched successfully");
          } else {
            toast.error("Asset not found");
            resetAssetId();
          }
        } catch (e) {
          setAssetId(0); // Reset to initial state instead of using RESET
          toast.error("Error fetching asset details from blockchain: " + e);
          console.error(e);
        } finally {
          setAssetDetailsLoading(false);
        }
      };

}