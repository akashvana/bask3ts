import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useState, useEffect } from 'react';
import { IBundler, Bundler } from '@biconomy/bundler'
import { BiconomySmartAccountV2, DEFAULT_ENTRYPOINT_ADDRESS } from "@biconomy/account"
import { ECDSAOwnershipValidationModule, DEFAULT_ECDSA_OWNERSHIP_MODULE } from "@biconomy/modules";
import { ethers  } from 'ethers'
import { ChainId } from "@biconomy/core-types"
import { 
  IPaymaster, 
  BiconomyPaymaster,  
} from '@biconomy/paymaster'
import CreateSession from '@/components/CreateSession';
import { useRouter } from 'next/router';


interface BasketData {
  basket_name: string;
  holdings: {
    ETH: number;
    DAI: number;
  };
}



export default function Home() {
  const [address, setAddress] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false);
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)
  const [basketData, setBasketData] = useState<BasketData | null>(null);
  
  const router = useRouter()

  const fetchBasketData = async() => {
    try{
      const response = await fetch('http://localhost:3000/api/basket/fetch?basketName=basket_1');
      const data = await response.json();
      setBasketData(data);
    }catch(error){
      console.error("Error fetching basket data: ", error);
    }
  }

  useEffect(() => {
    fetchBasketData();
  }, []);

  const bundler: IBundler = new Bundler({
    //https://dashboard.biconomy.io/
    // for testnets you can reuse this and change the chain id (currently 80001)
    bundlerUrl: "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44",    
    chainId: ChainId.POLYGON_MUMBAI,
    entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
  })

  const paymaster: IPaymaster = new BiconomyPaymaster({
    //https://dashboard.biconomy.io/
    //replace with your own paymaster url from dashboard (otherwise your transaction may not work :( )
    paymasterUrl: "https://paymaster.biconomy.io/api/v1/80001/bN77UefF7.145fff89-e5e1-40ec-be11-7549878eb08f"
  })

  const connect = async () => {
    // @ts-ignore
    const { ethereum } = window;
    try {
      setLoading(true)
      const provider = new ethers.providers.Web3Provider(ethereum)
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const ownerShipModule = await ECDSAOwnershipValidationModule.create({
        signer: signer
      })
      setProvider(provider)

      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: ownerShipModule,
        activeValidationModule: ownerShipModule,
      })
      const address = await biconomySmartAccount.getAccountAddress()
      setSmartAccount(biconomySmartAccount)
      console.log({ address })
      setAddress(address)
      console.log({ biconomySmartAccount })
      setLoading(false)
    } catch (error) {
      console.error(error);
    }
  };
  console.log({ smartAccount , provider })
  return (
    <>
      <Head>
        <title>Session Keys</title>
        <meta name="description" content="Build a dApp powered by session keys" />
      </Head>
      <main className={styles.main}>
        <h1>De-mandate</h1>
        <h2>Automate your purchase of crypto baskets </h2>

        {!basketData && <p>Loading basket data...</p>}
          {basketData && basketData.holdings && (
          <div className={styles.basketContainer} onClick={() => router.push('/subscribe')}>
            <h3>Basket Name: {basketData.basket_name}</h3>
            <p>ETH Holdings: {basketData.holdings.ETH}</p>
            <p>BTC Holdings: {basketData.holdings.DAI}</p>
          </div>
        )}
      
      </main>
    </>
  )
}