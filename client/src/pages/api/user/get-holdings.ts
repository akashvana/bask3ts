import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'dev',
    host: 'localhost',
    database: 'bask3ts',
    port: 5432,
});

export default async function getHoldings(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { walletAddress } = req.query;

    if (!walletAddress) {
        return res.status(400).json({ message: 'Wallet Address is required' });
    }

    try {
        const client = await pool.connect();

        // Retrieve the holdings for the given user
        const getHoldingsQuery = 'SELECT holdings FROM user_master WHERE wallet_address = $1';
        const result = await client.query(getHoldingsQuery, [walletAddress]);

        client.release();

        if (result.rows.length > 0) {
            const holdings = result.rows[0].holdings;
            res.status(200).json({ holdings });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}