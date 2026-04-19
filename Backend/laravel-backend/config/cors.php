<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | CORS is a browser security feature that blocks requests from a different
    | origin (e.g. frontend on port 3000 calling backend on port 8000).
    | This config tells Laravel which origins, methods, and headers are allowed.
    |
    | For your thesis:
    | - Frontend (Next.js) runs on localhost:3000
    | - Backend (Laravel) runs on localhost:8000
    | - Without this config, the browser would block all frontend API calls
    |
    */

    // Which URLs are allowed to make requests to this backend
    // We read from .env so this can be changed per environment
    // without touching the code
    'allowed_origins' => [
        env('FRONTEND_URL', 'http://localhost:3000'),
    ],

    // Allow all standard HTTP methods
    'allowed_methods' => ['*'],

    // Which paths CORS applies to
    // api/* covers all your API endpoints
    'paths' => ['api/*'],

    // Allow all headers — includes Authorization header
    // which is needed for Bearer token authentication
    'allowed_headers' => ['*'],

    // Whether cookies/credentials can be sent cross-origin
    // Required for Sanctum to work with the frontend
    'supports_credentials' => true,

    // Headers the browser is allowed to read from responses
    'exposed_headers' => [],

    // How long the browser caches CORS preflight responses (in seconds)
    // 0 means no caching during development — easier to debug
    'max_age' => 0,

    // Allow subdomains of allowed origins
    'allowed_origins_patterns' => [],
];
