import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'dev',
    host: 'localhost',
    database: 'bask3ts',
    port: 5432,
});

export default async function getBasketById(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { basketId },
  } = req;

  if (req.method === 'GET') {
    try {
      const client = await pool.connect();

      const getBasketQuery = 'SELECT * FROM cars WHERE brand = $1';
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

