<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\GuestSessionController;
use App\Http\Controllers\DisclaimerController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\HotlineController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\UserController;

/*
|--------------------------------------------------------------------------
| TEST ROUTE
|--------------------------------------------------------------------------
*/
Route::get('/test', function () {
    return response()->json([
        'message' => 'Backend is working'
    ]);
});

/*
|--------------------------------------------------------------------------
| PUBLIC AUTH ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

/*
|--------------------------------------------------------------------------
| GUEST ROUTES
|--------------------------------------------------------------------------
*/
Route::post('/guest', [GuestSessionController::class, 'create']);
Route::post('/guest/disclaimer', [DisclaimerController::class, 'acknowledge']);
Route::post('/guest/chat', [ChatController::class, 'sendMessage']);

/*
|--------------------------------------------------------------------------
| PUBLIC HOTLINES
|--------------------------------------------------------------------------
*/
Route::get('/hotlines', [HotlineController::class, 'index']);

/*
|--------------------------------------------------------------------------
| ADMIN ROUTE (TEMPORARILY PUBLIC FOR DEVELOPMENT)
|--------------------------------------------------------------------------
*/
Route::post('/admin/users', [AuthController::class, 'createUserByAdmin']);
Route::get('/admin/users', [UserController::class, 'index']);
Route::post('/admin/users', [UserController::class, 'store']);


/*
|--------------------------------------------------------------------------
| PROTECTED USER ROUTES
|--------------------------------------------------------------------------
*/
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/disclaimer', [DisclaimerController::class, 'acknowledge']);

    Route::post('/chat', [ChatController::class, 'sendMessage']);

    Route::get('/chat/history', [ChatController::class, 'getHistory']);

    Route::delete('/chat/history', [ChatController::class, 'deleteHistory']);
});