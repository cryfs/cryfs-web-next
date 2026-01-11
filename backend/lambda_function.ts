import type { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from 'aws-lambda';
import { email_myself } from './email';

const token = 'fd0kAn1zns';

const cors_headers = {
  'Access-Control-Allow-Origin': 'https://www.cryfs.org',
  'Access-Control-Allow-Credentials': false,
  Vary: 'Origin',
};

export interface LambdaResponse {
  statusCode: number;
  body: string;
  headers?: Record<string, string | boolean>;
}

export type LambdaHandler = (event: APIGatewayProxyEvent, context: Context) => Promise<APIGatewayProxyResult>;

export const LambdaFunction = (
  implementation: (body: Record<string, unknown>) => Promise<LambdaResponse>
): LambdaHandler =>
  async (event: APIGatewayProxyEvent, _context: Context): Promise<APIGatewayProxyResult> => {
    try {
      const body = JSON.parse(event.body || '{}') as Record<string, unknown>;

      if (body['token'] !== token) {
        return {
          statusCode: 400,
          headers: cors_headers,
          body: JSON.stringify({
            success: false,
            error: 'Wrong token',
          }),
        };
      }

      const response = await implementation(body);
      response.headers = Object.assign({}, response.headers || {}, cors_headers);
      return response as APIGatewayProxyResult;
    } catch (err) {
      console.log(`Error calling function. Error message: ${err}. Event: ${JSON.stringify(event)}`);
      await email_myself(
        'CryFS Backend',
        'Error',
        `Error calling function. Error message: ${err}. Event: ${JSON.stringify(event)}`
      );

      return {
        statusCode: 500,
        headers: cors_headers,
        body: JSON.stringify({
          success: false,
        }),
      };
    }
  };
