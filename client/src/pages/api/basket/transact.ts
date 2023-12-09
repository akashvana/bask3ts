import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import { Pool } from 'pg';

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

      // Check if amount is below minimum_amount
      if (amount < basket.minimum_amount) {
        return res.status(400).json({ success: false, message: 'Amount is below the minimum required amount' });
      }

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
