<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * GET ALL USERS
     */
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->get();

        return response()->json($users);
    }

    /**
     * CREATE USER (ADMIN)
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'email'      => 'required|email|unique:users,email',
            'school_id'  => 'required|string|max:255',
            'password'   => 'required|min:6',
        ]);

        $user = User::create([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'email'      => $request->email,
            'school_id'  => $request->school_id,
            'password'   => Hash::make($request->password),

            // IMPORTANT: default role
            'role'       => 'client',
        ]);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }

    public function deleteUser($id)
    {
        try {
            $user = User::find($id);

            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 404);
            }

            $user->delete();

            return response()->json([
                'message' => 'User deleted successfully'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Server error during deletion',
            ], 500);
        }
    }
}