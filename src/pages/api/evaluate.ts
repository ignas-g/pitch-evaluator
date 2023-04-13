import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { pitch } = req.body;

  try {

    const request = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Evaluate the following pitch as an expert entrepreneur by as many aspects as possible, such as clarity and market potential, rate each aspect 1-10: ${pitch}`,
        },
      ],
    };

    console.log('Request:', request);

    const response = await axios.post(
      apiEndpoint,
      request,
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const evaluation = response.data.choices[0].message.content.trim();

    res.status(200).json({ evaluation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
