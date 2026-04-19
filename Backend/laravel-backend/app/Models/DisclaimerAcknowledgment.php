<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DisclaimerAcknowledgment extends Model
{
    protected $fillable = [
        'user_id',
        'guest_session_token',
        'acknowledged_at'
    ];

    // Cast acknowledged_at as a datetime object so we can
    // format or compare it easily if needed later
    protected $casts = [
        'acknowledged_at' => 'datetime',
    ];

    // Relationship back to the user who acknowledged the disclaimer
    // Lets you do $acknowledgment->user to get the User object
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
