import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { SessionKeyManagerModule, DEFAULT_SESSION_KEY_MANAGER_MODULE  } from "@biconomy/modules";
import { BiconomySmartAccountV2 } from "@biconomy/account"
import { defaultAbiCoder } from "ethers/lib/utils";
import ERC20Transfer from "./ERC20Transfer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PushAPI, CONSTANTS } from "@pushprotocol/restapi";

interface props {
  smartAccount: BiconomySmartAccountV2;
  address: string;
  provider: ethers.providers.Provider;
}

const CreateSession: React.FC<props> = ({ smartAccount, address, provider }) => {
  const [isSessionKeyModuleEnabled, setIsSessionKeyModuleEnabled] = useState<boolean>(false);
  const [isSessionActive, setIsSessionActive] = useState<boolean>(false);

  useEffect(() => {
    let checkSessionModuleEnabled = async () => {
      if(!address || !smartAccount || !provider) {
        setIsSessionKeyModuleEnabled(false);
        return
      }
      try {
        const dcaSessionValidationModule = "0x4559f7f0985c761d991B52a03Bd9c32857F73AeD"
        const isEnabled = await smartAccount.isModuleEnabled(DEFAULT_SESSION_KEY_MANAGER_MODULE)
        console.log("isSessionKeyModuleEnabled", isEnabled);
        setIsSessionKeyModuleEnabled(isEnabled);
        return;
      } catch(err: any) {
        console.error(err)
        setIsSessionKeyModuleEnabled(false);
        return;
      }
    }
    checkSessionModuleEnabled()
  },[isSessionKeyModuleEnabled, address, smartAccount, provider])

  const createSession = async (enableSessionKeyModule: boolean) => {
    toast.info('Creating Session...', {
      position: "top-right",
      autoClose: 15000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      });
    if (!address || !smartAccount || !provider) {
      alert("Please connect wallet first")
    }
    try {
      const dcaSessionValidationModule = "0x4559f7f0985c761d991B52a03Bd9c32857F73AeD"
      // -----> setMerkle tree tx flow
      // create dapp side session key
      const sessionSigner = ethers.Wallet.createRandom();
      const sessionKeyEOA = await sessionSigner.getAddress();
      console.log("sessionKeyEOA", sessionKeyEOA);
      // BREWARE JUST FOR DEMO: update local storage with session key
      // window.localStorage.setItem("sessionPKey", sessionSigner.privateKey);
      localStorage.setItem('sessionPKey', sessionSigner.privateKey);

      // generate sessionModule
      const sessionModule = await SessionKeyManagerModule.create({
        moduleAddress: DEFAULT_SESSION_KEY_MANAGER_MODULE,
        smartAccountAddress: address,
      });

      const daysAfter = localStorage.getItem('numberOfDays')
      console.log("days after: ", daysAfter)
      // create session key data
      const sessionKeyData = defaultAbiCoder.encode(
        ["address", "uint256"],
        [
          sessionKeyEOA, // erc20 token address
          daysAfter
        ]
      );

      const sessionTxData = await sessionModule.createSessionData([
        {
          validUntil: 0,
          validAfter: 0,
          sessionValidationModule: dcaSessionValidationModule,
          sessionPublicKey: sessionKeyEOA,
          sessionKeyData: sessionKeyData,
        },
      ]);

      console.log("sessionTxData", sessionTxData);
      // const user = await PushAPI.initialize(sessionSigner, {env: CONSTANTS.ENV.STAGING});

      // 0x3f797ab4F1c4b0d2b859a0496133428dc44bC657
      // const subscribeChannel = await user.notification.subscribe(`eip155:80001:${0x791B5D49c2B320a3E2dA2CBe1905356d2647746C}`);

      // const sessionTxDataResponse = await user.channel.send(["*"], {
        // notification: {
          // title: "Session transaction",
          // body: "You have a new session transaction completed"
        // },
        // channel : "eip155:80001:0x791B5D49c2B320a3E2dA2CBe1905356d2647746C" // to send notif on polygon
      // });

      // tx to set session key
      const setSessiontrx = {
        to: DEFAULT_SESSION_KEY_MANAGER_MODULE, // session manager module address
        data: sessionTxData.data,
      };

      const transactionArray = [];

      if (enableSessionKeyModule) {
        // -----> enableModule session manager module
        const enableModuleTrx = await smartAccount.getEnableModuleData(
          DEFAULT_SESSION_KEY_MANAGER_MODULE
        );
        transactionArray.push(enableModuleTrx);
      }

      transactionArray.push(setSessiontrx)

      let partialUserOp = await smartAccount.buildUserOp(transactionArray);

      const userOpResponse = await smartAccount.sendUserOp(
        partialUserOp
      );


      const walletAddress = localStorage.getItem('eoaAddress')
      const sessionKey = localStorage.getItem('sessionPKey')
      const amount = localStorage.getItem('amount')
      const repeatDuration = localStorage.getItem('numberOfDays')

      console.log("wallet address: ", walletAddress)
      console.log("session key: ", sessionKey)
      console.log("amount: ", amount)
      console.log("repeatDuration: ", repeatDuration)
      const postBody = {
        walletAddress: walletAddress,
        sessionKey: sessionKey,
        basketName: "basket_1", 
        amount: amount,
        repeatDuration: repeatDuration 
      }


      // POST request to send data
      try {
        const response = await fetch('http://localhost:3000/api/user/set-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(postBody)
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        // const databaseUpdateResponse = await user.channel.send(["0x791B5D49c2B320a3E2dA2CBe1905356d2647746C"], {
        //   notification: {
        //     title: "Database Update!",
        //     body: "You have successfully saved your session key in the database with your recurrent time."
        //   },
        //   channel : "eip155:80001:0x791B5D49c2B320a3E2dA2CBe1905356d2647746C" // to send notif on polygon
        // });

        const responseData = await response.json();
        console.log('Server response:', responseData);
        toast.success('Data successfully sent to the server!', {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
      } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
        toast.error('Failed to send data to the server.', {
          position: "top-right",
          autoClose: 5000,
          theme: "dark",
        });
      }


      console.log(`userOp Hash: ${userOpResponse.userOpHash}`);
      const transactionDetails = await userOpResponse.wait();
      console.log("txHash", transactionDetails.receipt.transactionHash);
      setIsSessionActive(true)
      toast.success(`Success! Session created succesfully`, {
        position: "top-right",
        autoClose: 18000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        });
    } catch(err: any) {
      console.error(err)
    }
  }
  return (
    <div>
      <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      />
      {isSessionKeyModuleEnabled ? (
      <button onClick={() => createSession(false)} >Create Session</button>
      ) : (
        <button onClick={() => createSession(true)} >Enable and Create Session</button>
      )}
      {/* {isSessionActive && <ERC20Transfer smartAccount={smartAccount} provider={provider} address={address} />} */}
    </div>
    
  )
}

export default CreateSession;