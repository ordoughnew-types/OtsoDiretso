<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    /**
     * CLIENT SELF REGISTRATION
     */
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:6|confirmed',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'role'       => 'client',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'token'   => $token,
            'user'    => $user,
        ], 201);
    }

    /**
     * CLIENT LOGIN
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->role !== 'client') {
            return response()->json([
                'message' => 'No account found.',
                'error_type' => 'email'
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'error_type' => 'password',
                'message' => 'Incorrect password.'
            ], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user,
            'role'    => $user->role,
        ]);
    }

    /**
     * ADMIN LOGIN
     */
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'error_type' => 'email',
                'message' => 'No accounts found.'
            ], 404);
        }

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'error_type' => 'password',
                'message' => 'Incorrect password.'
            ], 401);
        }

        if ($user->role !== 'admin') {
            return response()->json([
                'error_type' => 'role',
                'message' => 'No accounts found.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Admin login successful',
            'token'   => $token,
            'user'    => $user,
            'role'    => $user->role,
        ]);
    }

    /**
     * LOGOUT
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * ADMIN CREATE USER
     */
    public function createUserByAdmin(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:6',
            'school_id'  => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            $errors = [];

            foreach ($validator->errors()->messages() as $field => $messages) {
                $errors[$field] = $messages[0];
            }

            return response()->json([
                'errors' => $errors
            ], 422);
        }

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'school_id'  => $request->school_id,
            'password'   => Hash::make($request->password),
            'role'       => 'client',
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ], 201);
    }

    /**
     * FORGOT PASSWORD (DEMO)
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Email not found'
            ], 404);
        }

        $token = Str::random(60);

        DB::table('password_resets')->updateOrInsert(
            ['email' => $user->email],
            [
                'email' => $user->email,
                'token' => $token,
                'created_at' => now()
            ]
        );

        $resetLink = "http://localhost:3000/reset-password?token=$token&email={$user->email}";

        Mail::raw("Reset your password: $resetLink", function ($message) use ($user) {
            $message->to($user->email)
                    ->subject('Password Reset Request');
        });

        return response()->json([
            'message' => 'Reset link sent to email'
        ]);
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:6'
        ]);

        // Find reset record
        $record = DB::table('password_resets')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$record) {
            return response()->json([
                'message' => 'Invalid or expired reset link'
            ], 400);
        }

        // Find user
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'message' => 'User not found'
            ], 404);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete token after use
        DB::table('password_resets')
            ->where('email', $request->email)
            ->delete();

        return response()->json([
            'message' => 'Password reset successful'
        ]);
    }
}