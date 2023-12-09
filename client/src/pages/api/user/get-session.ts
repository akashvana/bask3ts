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
export default async function getSessionKey(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username } = req.query;

    if (!username) {
        return res.status(400).json({ message: 'Username is required' });
    }

    try {
        const client = await pool.connect();

        // Retrieve the sessionKey for the user if sessionActive is true
        const getSessionKeyQuery = 'SELECT sessionKey FROM user_master WHERE username = $1 AND sessionActive = $2';
        const result = await client.query(getSessionKeyQuery, [username, true]);

        client.release();

        if (result.rows.length > 0) {
            const sessionKey = result.rows[0].sessionKey;
            res.status(200).json({ sessionKey });
        } else {
            res.status(404).json({ message: 'User not found or session not active' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}
