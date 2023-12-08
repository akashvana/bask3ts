import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'dev',
  host: 'localhost',
  database: 'bask3ts',
  port: 5432,
});

export default async function createUserHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const client = await pool.connect();
    try {
      const client = await pool.connect();
      await client.query('BEGIN');

      const createUserQuery = 'INSERT INTO cars (cars, model, year) VALUES ($1, $2, $3) RETURNING *';
      const newUser = await client.query(createUserQuery, [username, password]);

      await client.query('COMMIT');
      client.release();

      res.status(200).json({ success: true, user: newUser.rows[0] });
    } catch (error) {
      client.release();
      res.status(500).json({ success: false, error: error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
