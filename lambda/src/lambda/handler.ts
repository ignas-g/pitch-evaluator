import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  const allowedOrigins = ['http://localhost:3000', 'https://pitch-evaluator.vercel.app/'];
  const requestOrigin = event.headers.origin as string;
  const responseHeaders: { [key: string]: string } = {};

  if (allowedOrigins.includes(requestOrigin)) {
    responseHeaders['Access-Control-Allow-Origin'] = requestOrigin;
  }

  if (event.httpMethod === 'OPTIONS') {
    responseHeaders['Access-Control-Allow-Headers'] = 'Content-Type';
    responseHeaders['Access-Control-Allow-Methods'] = 'OPTIONS,POST';
    return {
      statusCode: 200,
      body: '',
      headers: responseHeaders,
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' }),
      headers: responseHeaders,
    };
  }

  const { pitch } = JSON.parse(event.body || '{}');

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

    return {
      statusCode: 200,
      body: JSON.stringify({ evaluation }),
      headers: responseHeaders,
    };
  } catch (error) {
    console.error('Handler error7', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
      headers: responseHeaders,
    };
  }
}
