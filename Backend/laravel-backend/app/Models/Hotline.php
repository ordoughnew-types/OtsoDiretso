<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotline extends Model
{
    protected $fillable = [
        'name',
        'category',
        'contact_number',
        'email',
        'website',
        'description',
        'is_active',
    ];

    // Cast is_active as boolean so it returns
    // true/false instead of 1/0 in JSON responses
    protected $casts = [
        'is_active' => 'boolean',
    ];

    // Scope to only return active hotlines
    // Usage: Hotline::active()->get()
    // This way inactive/outdated hotlines are never
    // returned to students without deleting them
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
