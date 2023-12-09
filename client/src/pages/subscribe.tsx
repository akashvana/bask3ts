// pages/subscribe.tsx

import Head from 'next/head';
import styles from '@/styles/Subscribe.module.css'; // Make sure to create this CSS module
import { useState } from 'react';
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

const Subscribe = () => {
    // Declare state variables
    const [address, setAddress] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false);
    const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2 | null>(null);
    const [provider, setProvider] = useState<ethers.providers.Provider | null>(null)
    const [amount, setAmount] = useState('');
    const [numberOfDays, setNumberOfDays] = useState('');
  
    const handleSubmit = async (event) => {
      event.preventDefault();
        // Process the form submission here
        console.log('Form submitted with: ', { amount, numberOfDays });

        // Save to local storage
        localStorage.setItem('amount', amount);
        localStorage.setItem('numberOfDays', numberOfDays);

        // Retrieve items from local storage and print them
        const savedAmount = localStorage.getItem('amount');
        const savedNumberOfDays = localStorage.getItem('numberOfDays'); // Changed variable name

        console.log('Saved Amount:', savedAmount);
        console.log('Saved Number of Days:', savedNumberOfDays);

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
          console.log({ smartAccount , provider })
        } catch (error) {
          console.error(error);
        }
    };
  
    // Handle input changes
    const handleAmountChange = (event) => {
      setAmount(event.target.value);
    };
  
    const handleDaysChange = (event) => {
      setNumberOfDays(event.target.value);
    };
    
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

    return (
      <>
        <Head>
          <title>Subscribe</title>
        </Head>
        <main className={styles.main}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <label htmlFor="amount" className={styles.formLabel}>Amount in USDC:</label>
            <input 
              type="number" 
              id="amount" 
              name="amount" 
              value={amount} 
              onChange={handleAmountChange} 
              required 
            />
  
            <label htmlFor="days" className={styles.formLabel}>Number of Days:</label>
            <input 
              type="number" 
              id="days" 
              name="days" 
              value={numberOfDays} 
              onChange={handleDaysChange} 
              required 
            />
  
            <button type="submit" className={styles.subscribeButton}>Subscribe</button>
            {!loading && !address}
            {<br></br>}
            {smartAccount && provider && <center><CreateSession smartAccount={smartAccount} address={address} provider={provider} /></center>}
            {/* Display basket data in a clickable rectangle */}
            {/* Check if basketData and basketData.holdings exist before rendering */}
            {/* Alternatively, handle the case when data is not available */}
          </form>
        </main>
      </>
    );
  };
  
  export default Subscribe;