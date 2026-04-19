<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    public function health()
    {
        $response = Http::get('http://127.0.0.1:8001/health');

        return response()->json([
            'from_fastapi' => $response->json()
        ]);
    }

    public function chat(Request $request)
{
    $response = Http::post('http://127.0.0.1:8001/chat', [
        'message' => $request->message
    ]);

    return response()->json($response->json());
}

}
