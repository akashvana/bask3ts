import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'ameygupta',
    host: 'localhost',
    database: 'bask3ts',
    password: 'amey',
    port: 5432, // Change it according to your configuration
});

export default async function getBasketById(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { basketId },
  } = req;

  if (req.method === 'GET') {
    try {
      const client = await pool.connect();

      const getBasketQuery = 'SELECT * FROM basket_master WHERE basket_id = $1';
      const result = await client.query(getBasketQuery, [basketId]);

      client.release();

      res.status(200).json({ success: true, data: result.rows });
    } catch (error) {
      res.status(500).json({ success: false, error: error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

