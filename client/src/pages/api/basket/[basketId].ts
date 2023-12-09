// pages/api/basket/[basketId].ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

// Create a new pool instance with your database configuration
const pool = new Pool({
    user: 'dev',
    host: 'localhost',
    database: 'bask3ts',
    port: 5432,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { basketName } = req.query;

        // Ensure basketId is provided
        if (!basketName) {
            res.status(400).json({ message: 'Basket Name is required' });
            return;
        }

        try {
            const client = await pool.connect();
            const query = 'SELECT * FROM basket_master WHERE basket_name = $1';
            const result = await client.query(query, [basketName]);
            client.release();

            if (result.rows.length > 0) {
                res.status(200).json(result.rows[0]);
            } else {
                res.status(404).json({ message: 'Basket not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
