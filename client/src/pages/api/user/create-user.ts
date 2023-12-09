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

    const { walletAddress, sessionKey } = req.body;

    if (!walletAddress || !sessionKey) {
        return res.status(400).json({ message: 'walletAddress, and sessionKey are required' });
    }

    try {
        const client = await pool.connect();

        const checkUserQuery = 'SELECT * FROM user_master WHERE wallet_address = $1';
        const checkResult = await client.query(checkUserQuery, [walletAddress]);

        if (checkResult.rows.length > 0) {
            client.release();
            return res.status(409).json({ message: 'User with provided username, email, or phone already exists' });
        }

        const insertUserQuery = 'INSERT INTO user_master (wallet_address, sessionKey, sessionActive) VALUES ($1, $2, $3)';
        await client.query(insertUserQuery, [walletAddress, sessionKey, true]);
        client.release();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}