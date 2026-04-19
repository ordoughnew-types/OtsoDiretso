<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GuestSession extends Model
{
    protected $fillable = ['session_token', 'expires_at'];

    // Tells Laravel to treat expires_at as a Carbon datetime object
    // instead of a plain string — this lets us use methods like
    // now()->greaterThan($this->expires_at) cleanly
    protected $casts = [
        'expires_at' => 'datetime',
    ];

    // Helper method to check if this guest session has expired
    // Used in DisclaimerController and later in ChatController
    // to reject requests from expired guest sessions
    public function isExpired(): bool
    {
        return $this->expires_at && now()->greaterThan($this->expires_at);
    }
}
