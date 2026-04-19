<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\GuestSession;
use Illuminate\Support\Str;

class GuestSessionController extends Controller
{
    /**
     * Create a new guest session.
     * Generates a UUID as a unique session token that the frontend
     * stores and sends with every guest request instead of a Bearer token.
     * Expires after 24 hours to prevent stale sessions accumulating
     * in the database indefinitely.
     */
    public function create()
    {
        $guest = GuestSession::create([
            // Str::uuid() generates a universally unique identifier
            // e.g. 550e8400-e29b-41d4-a716-446655440000
            'session_token' => Str::uuid(),
            'expires_at'    => now()->addHours(24),
        ]);

        return response()->json([
            'message'       => 'Guest session created',
            'session_token' => $guest->session_token,
            'expires_at'    => $guest->expires_at,
        ], 201);
    }
}
