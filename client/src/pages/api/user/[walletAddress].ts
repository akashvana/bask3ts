import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Create a new pool instance with your database configuration
const pool = new Pool({
    user: 'dev',
    host: 'localhost',
    database: 'bask3ts',
    port: 5432,
});

type UserData = {
    walletAddress: string;
    sessionActive: boolean;
    sessionKey: string;
    holdings: object;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserData | { message: string }>) {
    if (req.method === 'POST') {
        const { walletAddress } = req.query;

        // Basic validation
        if (!walletAddress) {
            res.status(400).json({ message: 'Wallet Address are required' });
            return;
        }

        const client = await pool.connect();

        try {
            const query = 'SELECT * FROM user_master WHERE walletAddress = $1';
            const result = await client.query<UserData>(query, [walletAddress]);

            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0]);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            client.release();
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
