"use strict";

import { email_myself } from './email'

const token = 'fd0kAn1zns'

const cors_headers = {
    'Access-Control-Allow-Origin': 'https://www.cryfs.org',
    'Access-Control-Allow-Credentials': false,
    'Vary': 'Origin',
}

export const LambdaFunction = (implementation) => (
    async (event, context) => {
        try {
            const body = JSON.parse(event['body'])

            if (body['token'] !== token) {
                // this is not for actual security but just to prevent spam from generic bots that don't know about the token
                return {
                    statusCode: 400,
                    headers: cors_headers,
                    body: JSON.stringify({
                        'success': false,
                        'error': 'Wrong token',
                    }),
                }
            }

            const response = await implementation(body)
            response.headers = Object.assign({}, response.headers || {}, cors_headers)
            return response

        } catch (err) {
            console.log(`Error calling function. Error message: ${err}. Event: ${JSON.stringify(event)}`)
            await email_myself("CryFS Backend", "Error", `Error calling function. Error message: ${err}. Event: ${JSON.stringify(event)}`)

            return {
                statusCode: 500,
                headers: cors_headers,
                body: JSON.stringify({
                    'success': false,
                }),
            }
        }
    }
)
