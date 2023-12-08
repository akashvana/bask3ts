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
export default async function createUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password, email, phone } = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({ message: 'Username, password, and email are required' });
    }

    try {
        const client = await pool.connect();

        // Check if the username, email, or phone already exists
        const checkUserQuery = 'SELECT * FROM user_master WHERE username = $1 OR email = $2 OR phone = $3';
        const checkResult = await client.query(checkUserQuery, [username, email, phone]);

        if (checkResult.rows.length > 0) {
            client.release();
            return res.status(409).json({ message: 'User with provided username, email, or phone already exists' });
        }

        // Insert the new user
        const insertUserQuery = 'INSERT INTO user_master (username, password, email, phone, sessionActive) VALUES ($1, $2, $3, $4, $5)';
        await client.query(insertUserQuery, [username, password, email, phone, false]);
        client.release();

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}
