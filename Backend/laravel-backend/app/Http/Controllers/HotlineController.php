<?php

namespace App\Http\Controllers;

use App\Models\Hotline;
use Illuminate\Http\Request;

class HotlineController extends Controller
{
    /**
     * Return all active hotlines grouped by category.
     *
     * Why grouped by category?
     * The frontend can display them in sections —
     * campus resources first, then national, then emergency.
     * This makes it easier for a distressed student to quickly
     * find the most relevant resource.
     *
     * This endpoint is public — no auth required.
     * A student in crisis should never be blocked from
     * accessing help resources by a missing token.
     */
    public function index()
    {
        $hotlines = Hotline::active()
            ->orderByRaw("FIELD(category, 'campus', 'national', 'emergency')")
            ->get();

        // Group by category for frontend convenience
        $grouped = $hotlines->groupBy('category');

        return response()->json([
            'hotlines' => $grouped,
        ]);
    }
}
