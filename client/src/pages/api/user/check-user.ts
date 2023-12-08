import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Initialize a connection pool
const pool = new Pool({
    user: 'dev', // your database username
    host: 'localhost',
    database: 'bask3ts', // your database name
    port: 5432,
});

// API handler function
export default async function checkUser(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const client = await pool.connect();
        const query = 'SELECT * FROM user_master WHERE username = $1 AND password = $2';
        const result = await client.query(query, [username, password]);
        client.release();

        if (result.rows.length > 0) {
            res.status(200).json({ exists: true });
        } else {
            res.status(200).json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}
