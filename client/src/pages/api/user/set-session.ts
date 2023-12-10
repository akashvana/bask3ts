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
export default async function updateSession(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { walletAddress, sessionKey, basketName, amount, repeatDuration} = req.body;

    try {
        const client = await pool.connect();

        // Update the sessionKey and set sessionActive to true for the given user
        const updateQuery = 'UPDATE user_master SET session_key = $1, session_active = true WHERE wallet_address = $2';
        const result = await client.query(updateQuery, [sessionKey, walletAddress]);
        client.release();

        if (result.rowCount === 0) {
            // No user was found with the given username
            return res.status(404).json({ message: 'User not found' });
        }

        const setQuery = 'INSERT INTO session_master (wallet_address, session_key, amount, basket_name, repeat_duration) values ($1, $2, $3, $4, $5)';
        const result2 = await client.query(setQuery, [walletAddress, sessionKey, amount, basketName, repeatDuration]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'session not created for user' });
        }

        res.status(200).json({ message: 'Session updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}
