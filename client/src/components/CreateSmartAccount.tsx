import Head from 'next/head'
import { useState } from 'react';
import { IBundler, Bundler } from '@biconomy-devx/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy-devx/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy-devx/modules";
import { ethers  } from 'ethers'
import { ChainId } from "@biconomy-devx/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy-devx/paymaster'



export default function Home() {
  const [address, setAddress] = useState<string>("")
  const [eoaAddress, setEoaAddress] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false);
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)

  const bundler: IBundler = new Bundler({
    //https://dashboard.biconomy.io/
    bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",    
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })
  
  const paymaster: IPaymaster = new BiconomyPaymaster({
    //https://dashboard.biconomy.io/
    paymasterUrl: "https://paymaster.biconomy.io/api/v1/80001/6BQRURJxx.4370cdbc-44b4-44be-a95e-1262d953c8c6"
  })

  const connect = async () => {
    // @ts-ignore
    const { ethereum } = window;
    try {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(ethereum)
      const accounts = await provider.send("eth_requestAccounts", []);
      setEoaAddress(accounts[0])
      console.log(accounts[0])
      
      const signer = provider.getSigner();
      const ownerShipModule = await ECDSAOwnershipValidationModule.create({
        signer: signer,
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE
      })
      setProvider(provider)
      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: ownerShipModule,
        activeValidationModule: ownerShipModule
      })
      setAddress( await biconomySmartAccount.getAccountAddress())
      let biconomySmartAccountAddress = biconomySmartAccount.getAccountAddress()
      console.log("Smart account address: ", biconomySmartAccountAddress)
      setSmartAccount(biconomySmartAccount)
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };
  
  return (

    // code to create smart contract wallet and also create the session keys. 

    // ask user to deposit x amount of funds to the smart contract wallet in the dialog box. 
    <>
      <Head>
        <title>Session Keys</title>
        <meta name="description" content="Build a dApp powered by session keys" />
      </Head>
      <main>
        <h1>Session Keys Demo</h1>
        <h2>Connect and transfer ERC20 tokens without signing on each transfer</h2>
        {!loading && !address && <button onClick={connect}>Connect to Web3</button>}
        {loading && <p>Loading Smart Account...</p>}
        {address && <h2>Smart Account: {address}</h2>}
      </main>
    </>
  )
}