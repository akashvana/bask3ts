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

    const { basketName, holdings } = req.body;

    if (!basketName || !holdings) {
        return res.status(400).json({ message: 'walletAddress, and se are required' });
    }

    try {
        const client = await pool.connect();

        const checkUserQuery = 'SELECT * FROM basket_master WHERE basket_name = $1';
        const checkResult = await client.query(checkUserQuery, [basketName]);

        if (checkResult.rows.length > 0) {
            client.release();
            return res.status(409).json({ message: 'Basket already exists' });
        }

        const insertUserQuery = 'INSERT INTO basket_master (basketName, holdings) VALUES ($1, $2)';
        await client.query(insertUserQuery, [basketName, holdings]);
        client.release();

        res.status(201).json({ message: 'Basket created successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error });
    }
}