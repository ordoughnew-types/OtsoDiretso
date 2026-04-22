<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

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
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Registration successful',
            'token'   => $token,
            'user'    => $user,
        ], 201);
    }

    /**
     * CLIENT LOG-IN ONLY
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // ❌ EMAIL NOT FOUND
        if (! $user) {
            return response()->json([
                'error_type' => 'email',
                'message' => 'No account found with this email.'
            ], 404);
        }

        // ❌ WRONG PASSWORD
        if (! Hash::check($request->password, $user->password)) {
            return response()->json([
                'error_type' => 'password',
                'message' => 'Incorrect password.'
            ], 401);
        }

        // ❌ BLOCK ADMIN FROM CLIENT LOGIN
        if ($user->role !== 'client') {
            return response()->json([
                'error_type' => 'role',
                'message' => 'No account found with this email.'
            ], 403);
        }

        // ✅ ALLOW CLIENT LOGIN ONLY
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => $user,
            'role'    => $user->role,
        ]);
    }

    /**
     * ADMIN LOG-IN ONLY
     */
    public function adminLogin(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        // ❌ EMAIL NOT FOUND
        if (! $user) {
            return response()->json([
                'error_type' => 'email',
                'message' => 'No admin account found with this email.'
            ], 404);
        }

        // ❌ WRONG PASSWORD
        if (! Hash::check($request->password, $user->password)) {
            return response()->json([
                'error_type' => 'password',
                'message' => 'Incorrect password.'
            ], 401);
        }

        // ❌ ONLY ADMINS ALLOWED
        if ($user->role !== 'admin') {
            return response()->json([
                'error_type' => 'role',
                'message' => 'No admin accounts found with this email.'
            ], 403);
        }

        // ✅ ADMIN LOGIN SUCCESS
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Admin login successful',
            'token'   => $token,
            'user'    => $user,
            'role'    => $user->role,
        ]);
    }

    /**
     * LOGOUT CURRENT SESSION
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ]);
    }

    /**
     * ADMIN: CREATE CLIENT USER
     */
    public function createUserByAdmin(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:6',
            'school_id'  => 'required|string|max:255',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'school_id'  => $request->school_id,
            'password'   => Hash::make($request->password),
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user,
        ], 201);
    }
}