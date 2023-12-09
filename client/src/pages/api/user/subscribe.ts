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

    const { walletAddress, sessionKey, basketName, amount, repeatDuration } = req.body;

    if (!walletAddress || !sessionKey || !basketName || !amount) {
        return res.status(400).json({ message: 'all details are required' });
    }

    try {
        const client = await pool.connect();

        const updateUserQuery = 'UPDATE user_master SET session_key = $1, session_active = true WHERE wallet_address = $2';
        const userResult = await client.query(updateUserQuery, [sessionKey, walletAddress]);

        // Update the sessionKey and set sessionActive to true for the given user
        const updateQuery = 'UPDATE session_master SET basket_name = $2, amount = $3, last_transaction_date = TO_CHAR(current_date, \'YYYY-MM-DD\'), repeat_duration = $4 WHERE session_key = $1';
        const result = await client.query(updateQuery, [sessionKey, basketName, amount, repeatDuration]);
        client.release();

        if (userResult.rowCount === 0) {
            // No user was found with the given username
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'Session updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}