import { NextApiRequest, NextApiResponse } from 'next';
import { Pool } from 'pg';
import axios from 'axios';

const pool = new Pool({
  user: 'dev',
  host: 'localhost',
  database: 'bask3ts',
  port: 5432,
});

//put transact api here
const apiUrl = 'https://localhost:3001/transact';

export default async function cronHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const client = await pool.connect();
    try {
      const currentDate = new Date().toISOString().split('T')[0];

      const selectQuery = 'SELECT user_id, lastTransactionDate, repeatDuration FROM user_master WHERE sessionActive = TRUE';

      const rows = await client.query(selectQuery);

      for (const row of rows.rows) {
        const { session_key, lasttransactiondate, repeatduration } = row;
        const nextTransactionDate = new Date(lasttransactiondate);
        nextTransactionDate.setDate(nextTransactionDate.getDate() + repeatduration);

        if (currentDate === nextTransactionDate.toISOString().split('T')[0]) {
          const updateQuery = `UPDATE session_master SET lastTransactionDate = '${currentDate}' WHERE session_key = ${session_key}`;
          await client.query(updateQuery);

          const response = await axios.put(apiUrl);
          console.log(`User ID ${session_key}: API called. Response: ${response.status}`);
        }
      }

      client.release();
      res.status(200).json({ success: true, message: 'Cron job executed successfully' });
    } catch (error) {
      client.release();
      console.error('Error executing cron job:', error);
      res.status(500).json({ success: false, error: error });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}