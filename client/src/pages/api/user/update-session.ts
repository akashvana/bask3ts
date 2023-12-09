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

    const { walletAddress, sessionKey } = req.body;

    if (!walletAddress || !sessionKey) {
        return res.status(400).json({ message: 'walletAddress and sessionKey are required' });
    }

    try {
        const client = await pool.connect();

        // Update the sessionKey and set sessionActive to true for the given user
        const updateQuery = 'UPDATE user_master SET sessionKey = $1, sessionActive = true WHERE username = $2';
        const result = await client.query(updateQuery, [sessionKey, walletAddress]);
        client.release();

        if (result.rowCount === 0) {
            // No user was found with the given username
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Session updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}
