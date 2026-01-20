/**
 * API Configuration
 *
 * This file contains configuration values for API communication between
 * the frontend and backend services.
 */

/**
 * Authentication token used to validate requests from frontend to backend.
 * This token must match the token configured in the backend lambda_function.ts
 *
 * NOTE: This does NOT provide actual security (it's visible in the client-side code).
 * It's only meant to block naive bots and scrapers who don't know about it.
 * Do not rely on this for authentication or authorization.
 */
export const API_AUTH_TOKEN = '6BK2tEU6Cv';
