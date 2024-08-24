// Importing necessary Next.js types and the cors middleware
import type { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

// Initialize CORS middleware with your specific configuration
const cors = Cors({
    origin: 'https://kos-store-master-q1n2wbfyh-luis-diazs-projects-53ef6375.vercel.app', // Change this to match the URL of your frontend app
    methods: ['POST', 'OPTIONS'], // List of allowed methods
    credentials: true, // This option allows cookies to be sent and is essential for sessions to work properly if you use them
    allowedHeaders: ['Content-Type', 'Authorization'], // Specify headers that are allowed
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

// Default export of the API route using an asynchronous function
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // First, run CORS middleware
    await runMiddleware(req, res, cors);

    // Check the HTTP method
    if (req.method === 'POST') {
        // Handle POST request logic here
        // For example, process webhook data
        res.status(200).json({ message: 'Webhook received and processed successfully!' });
    } else {
        // If any method other than POST is used, return a 405 Method Not Allowed
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
