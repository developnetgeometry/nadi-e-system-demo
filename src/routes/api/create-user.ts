
// This is a client-side API route that will be fetched by the browser
// It maps to our existing createUser.ts file

import { createUser } from './createUser';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const requestData = req.body;
      const result = await createUser(requestData);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
