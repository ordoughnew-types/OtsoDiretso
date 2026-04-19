<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GuestSessionController;
use App\Http\Controllers\DisclaimerController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\HotlineController;
use Illuminate\Support\Facades\Route;

// Test
Route::get('/test', function () {
    return response()->json([
        'message' => 'Backend is working'
    ]);
});

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/guest',    [GuestSessionController::class, 'create']);

// Hotline resources — public, no auth required
// A student in crisis must always be able to access this
Route::get('/hotlines',  [HotlineController::class, 'index']);

// Guest routes
Route::post('/guest/disclaimer', [DisclaimerController::class, 'acknowledge']);
Route::post('/guest/chat',       [ChatController::class, 'sendMessage']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',         [AuthController::class, 'logout']);
    Route::post('/disclaimer',     [DisclaimerController::class, 'acknowledge']);
    Route::post('/chat',           [ChatController::class, 'sendMessage']);
    Route::get('/chat/history',    [ChatController::class, 'getHistory']);
    Route::delete('/chat/history', [ChatController::class, 'deleteHistory']);
});
