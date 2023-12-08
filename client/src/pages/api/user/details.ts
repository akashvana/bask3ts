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
    username: string;
    email: string;
    phone: string;
    sessionActive: boolean;
    sessionKey: string;
    holdings: object;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<UserData | { message: string }>) {
    if (req.method === 'POST') {
        const { username, password } = req.body;

        // Basic validation
        if (!username || !password) {
            res.status(400).json({ message: 'Username and password are required' });
            return;
        }

        const client = await pool.connect();

        try {
            // Query the database
            const query = 'SELECT * FROM user_master WHERE username = $1 AND password = $2';
            const result = await client.query<UserData>(query, [username, password]);

            if (result.rows.length > 0) {
                // Return the user data
                res.status(200).json(result.rows[0]);
            } else {
                // No user found
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        } finally {
            client.release();
        }
    } else {
        // Handle non-POST requests
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
