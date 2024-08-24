// Import necessary modules from Next.js and CORS package
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

// Initialize CORS middleware with specific options
const cors = Cors({
  methods: ['POST', 'OPTIONS'], // Specify the methods allowed
  origin: 'https://kos-store-master-q1n2wbfyh-luis-diazs-projects-53ef6375.vercel.app', // Frontend domain
  credentials: true, // This is required if cookies are sent
});

// Helper function to run middleware
function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// API route handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Run CORS middleware to handle CORS preflight requests and ensure security
  await runMiddleware(req, res, cors);

  if (req.method === 'POST') {
    // Logic for handling POST requests
    // You can process your webhook data here
    res.status(200).json({ message: 'Webhook received and processed successfully' });
  } else {
    // Handle other methods or return an error for methods not supported
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
