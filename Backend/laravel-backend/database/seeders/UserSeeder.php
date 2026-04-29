<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([

            // =======================
            // 👑 ADMIN ACCOUNT
            // =======================
            [
                'first_name' => 'Admin',
                'last_name' => 'User',
                'school_id' => '000001',
                'email' => 'admin01@slu.edu.ph',
                'password' => Hash::make('admin01'),
                'role' => 'admin',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}