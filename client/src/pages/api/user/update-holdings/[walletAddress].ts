import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Initialize a connection pool
const pool = new Pool({
    user: 'dev',
    host: 'localhost',
    database: 'bask3ts',
    port: 5432,
});

// API handler function
export default async function updateHoldings(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { walletAddress } = req.query;
    const { holdings } = req.body;

    if (!walletAddress || !holdings) {
        return res.status(400).json({ message: 'walletAddress and holdings are required' });
    }

    try {
        const client = await pool.connect();

        
        // Update the holdings for the given user
        const updateQuery = 'UPDATE user_master SET holdings = $1 WHERE wallet_address = $2';
        const result = await client.query(updateQuery, [holdings, walletAddress]);
        client.release();

        if (result.rowCount === 0) {
            // No user was found with the given username
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Holdings updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}
