import { Algodv2, NetworkId, SenderType, Transaction, Arc59Client, LogDataType, TxnInfoType } from 'algosdk';

export class Arc59 {
  createArc59GroupTxns = async (
    txn: Transaction[],
    sender: SenderType,
    activeAddress: string,
    algodClient: Algodv2,
    activeNetwork: NetworkId
  ) => {
    const txnInfo: TxnInfoType = {
      atomicTxns: [],
      logDataArray: [],
      grandTotal: 0,
      csv: '',
    };

    // const atomicTxns: algosdk.AtomicTransactionComposer[] = [];
    const logDataArray: LogDataType[] = [];
    const appId = activeNetwork === 'mainnet' ? 2449590623 : 643020148;
    const suggestedParams = await algodClient.getTransactionParams().do();

    try {
      const appClient = new Arc59Client(
        {
          sender,
          resolveBy: 'id',
          id: appId,
        },
        algodClient
      );

      const simSender = {
        addr: activeAddress,
        signer: algosdk.makeEmptyTransactionSigner(),
      };
      const simParams = {
        allowEmptySignatures: true,
        allowUnnamedResources: true,
        fixSigners: true,
      };
      for (let i = 0; i < txn.length; i++) {
        const logData: LogDataType = {} as LogDataType;
        const receiver = algosdk.encodeAddress(txn[i].to.publicKey);
        logData.account = receiver;

        const composer = appClient.compose();
        const appAddr = (await appClient.appClient.getAppReference())
          .appAddress;
        const [
          itxns,
          mbr,
          routerOptedIn,
          receiverOptedIn,
          receiverAlgoNeededForClaim,
        ] = (
          await appClient
            .compose()
            .arc59GetSendAssetInfo(
              {
                asset: txn[i].assetIndex,
                receiver: receiver,
              },
              {
                sender: {
                  ...simSender,
                  addr: activeAddress,
                },
              }
            )
            .simulate(simParams)
        ).returns[0];

        if (receiverOptedIn) {
          console.log('Receiver is opted in');
          const atc = new algosdk.AtomicTransactionComposer();
          atc.addTransaction({ txn: txn[i], signer: sender.signer });
          atc.buildGroup();

          // push data to the arrays
          txnInfo.atomicTxns.push(atc);

          // update the logDataArray
          logDataArray.push({
            ...logData,
            txnFees: algosdk.ALGORAND_MIN_TX_FEE,
            innerTxns: 0,
            receiverOptedIn: true,
            mbr: 0,
            receiverAlgoNeededForClaim: 0,
            routerOptedIn: routerOptedIn,
            totalAmount: algosdk.ALGORAND_MIN_TX_FEE,
            txnID: '',
          });
        } else {
          logData.txnFees = 0;

          // log the inner txns plus the txn fee
          logData.innerTxns = Number(itxns) * algosdk.ALGORAND_MIN_TX_FEE;
          logData.txnFees += algosdk.ALGORAND_MIN_TX_FEE;

          let amount = 0;
          logData.receiverOptedIn = receiverOptedIn;

          logData.mbr = Number(mbr) || 0;
          logData.receiverAlgoNeededForClaim =
            Number(receiverAlgoNeededForClaim) || 0;

          if (mbr || receiverAlgoNeededForClaim) {
            // If the MBR is non-zero, send the MBR to the router
            const mbrPayment =
              algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                to: appAddr,
                from: activeAddress,
                suggestedParams,
                amount: Number(mbr + receiverAlgoNeededForClaim),
              });

            // add the MBR payment to the atomic transaction plus the txn fee
            amount +=
              Number(mbr + receiverAlgoNeededForClaim) +
              algosdk.ALGORAND_MIN_TX_FEE;

            logData.txnFees += algosdk.ALGORAND_MIN_TX_FEE;

            // add the MBR payment to the atomic transaction
            composer.addTransaction({
              txn: mbrPayment,
              signer: sender.signer,
            });
          }

          // If the router is not opted in, add a call to arc59OptRouterIn to do so
          if (!routerOptedIn) {
            composer.arc59OptRouterIn({ asa: txn[i].assetIndex });

            // opt-in txn fee
            amount += algosdk.ALGORAND_MIN_TX_FEE;
            logData.txnFees += algosdk.ALGORAND_MIN_TX_FEE;
          }
          logData.routerOptedIn = routerOptedIn;

          // The transfer of the asset to the router
          txn[i].to = algosdk.decodeAddress(appAddr);

          // An extra itxn is if we are also sending ALGO for the receiver claim
          const totalItxns =
            itxns + (receiverAlgoNeededForClaim === 0n ? 0n : 1n);

          amount += algosdk.ALGORAND_MIN_TX_FEE * Number(totalItxns + 1n);

          const fee = (
            algosdk.ALGORAND_MIN_TX_FEE * Number(totalItxns + 1n)
          ).microAlgos();
          const boxes = [algosdk.decodeAddress(receiver).publicKey];
          const inboxAddress = (
            await appClient
              .compose()
              .arc59GetInbox({ receiver: receiver }, { sender: simSender })
              .simulate(simParams)
          ).returns[0];

          const accounts = [receiver, inboxAddress];
          const assets = [Number(txn[i].assetIndex)];
          composer.arc59SendAsset(
            {
              axfer: txn[i],
              receiver: receiver,
              additionalReceiverFunds: receiverAlgoNeededForClaim,
            },
            { sendParams: { fee }, boxes, accounts, assets }
          );
          // asset send txn fee
          amount += algosdk.ALGORAND_MIN_TX_FEE;
          logData.txnFees += algosdk.ALGORAND_MIN_TX_FEE;
          logData.totalAmount = amount;
          logData.txnID = ''; // empty txnID

          // get the atomic transaction composer
          const atc = await composer.atc();

          // Adjust the app call to 1000 rounds instead of 10 rounds
          const originalTxns = atc.clone().buildGroup();
          const unsignedTxn = originalTxns.map((txn) => {
            txn.txn.lastRound = txn.txn.firstRound + 1000;
            txn.txn.group = undefined;
            return txn.txn;
          });

          const newATC = new algosdk.AtomicTransactionComposer();
          unsignedTxn.forEach((txn) => {
            newATC.addTransaction({ txn: txn, signer: sender.signer });
          });

          newATC.buildGroup();
          // push data to the arrays
          txnInfo.atomicTxns.push(newATC);
          logDataArray.push(logData);
        }
      }
    } catch (e) {
      console.error(e);
      throw e;
    }
    // Create CSV file for txn logs
    txnInfo.csv = await convertToCSV(logDataArray);
    txnInfo.grandTotal = logDataArray
      .map((logData) => logData.totalAmount)
      .reduce((a, b) => a + b, 0);

    console.log('Grand Total: ', txnInfo.grandTotal);
    txnInfo.logDataArray = logDataArray;
    return txnInfo;
  };
}
