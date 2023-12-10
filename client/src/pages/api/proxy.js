// pages/api/proxy.js
import fetch from 'node-fetch'; // You might need to install node-fetch if not already

export default async function handler(req, res) {
  const url = 'https://rpc.ankr.com/polygon_mumbai';

  try {
    const externalApiResponse = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Include any other headers needed for the external API
      },
      body: JSON.stringify(req.body),
    });

    const data = await externalApiResponse.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error proxying the request' });
  }
}