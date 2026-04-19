<?php

namespace App\Http\Controllers;

use App\Models\DisclaimerAcknowledgment;
use App\Models\GuestSession;
use Illuminate\Http\Request;

class DisclaimerController extends Controller
{
    /**
     * Record that a user or guest has acknowledged the disclaimer.
     * This is required before accessing the chatbot — it ensures
     * the user understands the chatbot is non-clinical support only.
     *
     * Registered users are identified via their Sanctum token.
     * Guest users are identified via their session_token in the request body.
     */
    public function acknowledge(Request $request)
    {
        // Registered user flow — Sanctum already verified their token
        if ($request->user()) {
            DisclaimerAcknowledgment::updateOrCreate(
                // Find by user_id — one acknowledgment per user
                ['user_id' => $request->user()->id],
                // Update or set the acknowledged timestamp
                ['acknowledged_at' => now()]
            );

            return response()->json(['message' => 'Disclaimer acknowledged']);
        }

        // Guest user flow — no token, uses session_token instead
        $request->validate([
            'guest_session_token' => 'required|string',
        ]);

        $guest = GuestSession::where(
            'session_token', $request->guest_session_token
        )->first();

        // Reject if session doesn't exist or has expired
        if (! $guest || $guest->isExpired()) {
            return response()->json([
                'message' => 'Invalid or expired guest session'
            ], 401);
        }

        DisclaimerAcknowledgment::updateOrCreate(
            ['guest_session_token' => $request->guest_session_token],
            ['acknowledged_at' => now()]
        );

        return response()->json(['message' => 'Disclaimer acknowledged']);
    }
}
