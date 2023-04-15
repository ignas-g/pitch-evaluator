import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import axios from 'axios';

const apiKey = process.env.OPENAI_API_KEY;
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {

  try {
    const { pitch } = event as any;

    console.log('Request:', event, apiKey, pitch);

    if(!pitch) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Bad request - no pitch provided' }),
        headers: {},
      };
    }

    const request = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Evaluate the following pitch as an expert entrepreneur by as many aspects as possible, such as Clarity, Market Potential, Innovation, Feasibility, Investability, Scalability, Market size, Problem identification, Solution uniqueness, Competitive advantage, Business model
 Target audience, IP protection and Overall, rate each aspect x/10, return the parameters and any additional data separated by EOL (\\n): ${pitch}`,
        },
      ],
    };



    console.log('Request:', event, request, apiKey);

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
      headers: {},
    };
  } catch (error) {
    console.error('Handler error10', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
      headers: {},
    };
  }
}
