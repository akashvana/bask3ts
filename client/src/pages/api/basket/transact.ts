import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Pool } from 'pg';
import { ethers } from 'ethers';
import { abi as IUniswapV3RouterABI } from '@uniswap/v3-periphery/artifacts/contracts/interfaces/IUniswapV3Router.sol/IUniswapV3Router.json';
import dotenv from 'dotenv'

dotenv.config()

const pool = new Pool({
  user: 'dev',
  host: 'localhost',
  database: 'bask3ts',
  port: 5432, // Change it according to your configuration
});

const swapApiUrl = 'https://uniswap-api.com/swap';

export default async function divideAmountHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { basket_name, amount } = req.body;

      if (!basket_name || !amount) {
        return res.status(400).json({ success: false, message: 'Both basket_name and amount parameters are required' });
      }

      // Query the database for basket details
      const basketQuery = 'SELECT * FROM basket_master WHERE basket_name = $1';
      const basketResult = await pool.query(basketQuery, [basket_name]);

      if (basketResult.rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Basket not found' });
      }

      const basket = basketResult.rows[0];

      // Extract holdings from the basket details
      const holdings = basket.holdings;

      // Calculate amounts based on holdings ratios
      const totalRatio = 100;
      const amounts: { [key: string]: number } = {};

      for (const coin in holdings) {
        const ratio = holdings[coin];
        const coinAmount = (amount * ratio) / totalRatio;
        amounts[coin] = coinAmount;

        // Call the swap API for each coin
        await callSwapApi(coin, coinAmount);
      }

      res.status(200).json({ success: true, amounts });
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ success: false, error: error || 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

async function callSwapApi(coin: string, amount: number) {
  try {
    // Replace the following line with the actual call to your swap API
    const response = await axios.post(swapApiUrl, { coin, amount });

    console.log(`Swap API called for ${coin}. Response:`, response.data);
  } catch (error) {
    console.error(`Error calling swap API for ${coin}:`, error || 'Unknown error');
  }
}

async function swapUSDCForToken(amountIn: string, isEth: boolean ){
  try{
    const apiUrl = process.env.ALCHEMY_API_URL
    const provider = new ethers.providers.JsonRpcProvider(apiUrl)
    const uniswapRouterAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // Uniswap V3 Router
    const USDCAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eb48';
    const DAIAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
    const WETHAddress = '0xc778417E063141139Fce010982780140Aa0cD5Ab';

    const dcaSessionValidationModule = "0x4559f7f0985c761d991B52a03Bd9c32857F73AeD"
    let destinationToken
    if(!isEth){
      destinationToken = DAIAddress
    }else{
      destinationToken = WETHAddress
    }

    const uniswapRouter = new ethers.Contract(uniswapRouterAddress, IUniswapV3RouterABI, signer);
    const signer = new ethers.Wallet(privateKey, provider);

    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from the current Unix time
    const recipient = signer.address;
    const amountOutMinimum = 0; // Set to 0 for simplicity, but should be calculated based on slippage
    const path = [USDCAddress, isEth ? WETHAddress : DAIAddress]; // Path for the swap
    const swapParams = {
        deadline,
        recipient,
        amountIn,
        amountOutMinimum,
        path
    };

  }
}


let destinationAddressMap: Record<string, string> = {
  ETH: "value1",
  DAI: "value2",
};