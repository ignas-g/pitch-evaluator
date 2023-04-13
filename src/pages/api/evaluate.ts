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
          content: `Generate code or commands in the following JSON format to: ${prompt}\n
            [
              {
                "operation": "operation_type", /* should be either: create, replace, append, move, rename, delete, execute */
                "filePath": "file_path",
                "rest": ["additional_parameters"] /* can contain file contents lines (in case of  create, replace, append), new file name (in case of move, rename) or command parameters (for execute) */
              }
            ]
            `,
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
