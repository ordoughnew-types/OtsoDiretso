<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatMessage extends Model
{
    protected $fillable = [
        'user_id',
        'guest_session_token',
        'role',
        'message',
    ];

    // Relationship back to the user who sent/received this message
    // Lets you do $message->user to get the User object
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
