import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';

const pool = new Pool({
  user: 'ameygupta',
  host: 'localhost',
  database: 'bask3ts',
  password: 'amey',
  port: 5432, // Change it according to your configuration
});

export default async function loginHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    const client = await pool.connect();
    try {

      const findUserQuery = 'SELECT * FROM users WHERE username = $1 AND password = $2';
      const user = await client.query(findUserQuery, [username, password]);

      client.release();

      if (user.rows.length > 0) {
        res.status(200).json({ success: true, message: 'Login successful' });
      } else {
        res.status(401).json({ success: false, message: 'Invalid username or password' });
      }
    } catch (error) {
      client.release();
      res.status(500).json({ success: false, error: error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
