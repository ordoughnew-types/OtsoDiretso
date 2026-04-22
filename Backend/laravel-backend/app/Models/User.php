<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    // HasApiTokens — adds Sanctum token methods to this model
    // like $user->createToken() and $user->tokens()
    // Without this, login won't be able to generate tokens
    use HasApiTokens, HasFactory;

    // $fillable lists which columns are allowed to be mass-assigned
    // meaning you can do User::create([...]) safely
    // Columns NOT in this list are protected from bulk assignment
    protected $fillable = ['first_name', 'last_name', 'email', 'password', 'school_id'];

    // $hidden prevents these fields from appearing in JSON responses
    // You never want to accidentally return a password in an API response
    protected $hidden = ['password', 'remember_token'];

    // Relationship: one user can have one disclaimer acknowledgment
    // This lets you do $user->disclaimerAcknowledgment to get their record
    public function disclaimerAcknowledgment()
    {
        return $this->hasOne(DisclaimerAcknowledgment::class);
    }
    // One user can have many chat messages
    // Lets you do $user->chatMessages to get all their messages
    // ordered from oldest to newest for display
    public function chatMessages()
    {
        return $this->hasMany(ChatMessage::class)->orderBy('created_at', 'asc');
    }
}
