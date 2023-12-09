import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'dev',
    host: 'localhost',
    database: 'bask3ts',
    port: 5432,
});

export default async function createUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { walletAddress} = req.body;

    if (!walletAddress) {
        return res.status(400).json({ message: 'walletAddress is required' });
    }

    try {
        const client = await pool.connect();

        const insertUserQuery = 'INSERT INTO user_master (wallet_address) VALUES ($1)';
        await client.query(insertUserQuery, [walletAddress]);
        client.release();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}